import { TodoListData } from './../dataTypes/TodoListData';
import { ChangeDetectionStrategy, Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { TodoItemData } from '../dataTypes/TodoItemData';
import { TodoService } from '../todo.service';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoListComponent implements OnInit {

  @Input()
  @ViewChild('newTodoInput') redel:ElementRef;
  private data: TodoListData; //Current item of the TodoList
  private past: [TodoListData];

  futur: Array<{todo: TodoItemData}> = [];
  private titre: string;
  private filtre: string = 'all';  //Used to see which elements must be seen either 'completed', 'active' or 'all'


  constructor(private todoService: TodoService) {
    todoService.getTodoListDataObserver().subscribe( tdl => this.data = tdl);
    this.titre = this.data.label;
  }

  ngOnInit() {
    //Récupérer les trucs dans le localStorage
    if(localStorage.length > 0)
    {
      console.log("Le premier item sant le parse : ",localStorage.getItem("item 1"));
      console.log("Le premier item avec le parse : ",JSON.parse(localStorage.getItem("item 1")));
      for(let i=0; i < localStorage.length; i++){
        let key = localStorage.key(i);
        let item = JSON.parse(localStorage.getItem(key));
        this.todoService.appendItems(item[0]);
      }
    }
  }

  get label(): string {
    return this.data ? this.data.label : '';
  }

  get items(): TodoItemData[] {
    return this.data ? this.data.items : [];
  }

  /**
   * Call the todoService function in order to create a new Todo in the Todolist with the given label
   * @param label
  */
  appendItem(label: string) {
    this.todoService.appendItems(
      { label, isDone: false}
    );
  //Get rid of the text when we enter a new object
  this.redel.nativeElement.value="";
  }

  /**
   * Set a label to the given state (done or undone)
   * @param item
   * @param label
  */
  itemDone(item: TodoItemData, done: boolean){
    this.todoService.setItemsDone(done, item);
  }

  /**
   * Set a label to an item
   * @param item
   * @param label
  */
  itemLabel(item: TodoItemData, label: string){
    this.todoService.setItemsLabel(label, item);
  }

  /**
   * Remove an item from the TodoList
   * @param item
  */
  removeItem(item: TodoItemData){
    this.todoService.removeItems(item);
  }

  /**
   * Set an item to the oposite state (done => undone)
   * @param item
  */
  checkItem(item: TodoItemData){
    this.todoService.setItemsDone(!item.isDone, item);
  }

  /**
   * Changes the filtre value
  */
  show(value){
    this.filtre = value;
  }

  /**
   * Count the remaining undone item. 
  */
  countItems():number{
    return (this.data.items.length - this.data.items.filter(item=>item.isDone).length);
  }

  /**
   * Delete the all Done item from data
  */
  deleteDone():void{
    console.log(this.data)
    for(let Data in this.data.items)
    {
      if(this.data.items[Data].isDone)
      {
        console.log("J'envoie : ", this.data.items[Data]);
        this.todoService.removeLocalStorage(this.data.items[Data]);
        this.removeItem(this.data.items[Data]);
        this.deleteDone();
        break;
      }
    }
  }

  saveCurrent():void{
    this.todoService.appendFutur(this.data.items);
  }

  /**
   * Delete all item from data et save the current TodoList in Futur[]
  */
 deleteAll():void{
  for(let Data in this.data.items){
    this.removeItem(this.data.items[Data]);
    this.deleteAll();
  }
}  

  /**
   * Set all the items inside the ToDoList to done
  */
  selectAll():void
  {
    for(let Data in this.data.items)
    {
      if(this.data.items[Data].isDone == false)
      {
        this.itemDone(this.data.items[Data],true);
      }
    }    
  }

  /**
   * Checks if an item is asked, if so, he can be displayed
   * @param data
   */
  isItemShown(data){
    if(this.filtre==='all'){
      return true;
    }
    if(this.filtre==='actives' && !data.isDone){
      return true;
    }
    if(this.filtre==='completed' && data.isDone){
      return true;
    }
    return false;
  }

  undo()
  {
    let lengthVoulu = this.todoService.empList.length;
    lengthVoulu = lengthVoulu -1;
    console.log("L'empList :",this.todoService.empList);
    if(this.todoService.empList!=null) //Faudrait le claquer dans le futur[]
    {
      this.saveCurrent();
      this.deleteAll();
    }

    for(let Data in this.todoService.empList[lengthVoulu])
    {
      this.todoService.appendItems(this.todoService.empList[lengthVoulu][Data]);
    }

  }

  redo()
  {
    let lengthVoulu = this.todoService.future.length;
    lengthVoulu = lengthVoulu-1;
    console.log("LE FUUUUUTUUUUR : ", this.todoService.future);
    for(let Data in this.todoService.future[lengthVoulu])
    {
      this.todoService.appendItems(this.todoService.future[lengthVoulu][Data]);
    }
    

  }
}