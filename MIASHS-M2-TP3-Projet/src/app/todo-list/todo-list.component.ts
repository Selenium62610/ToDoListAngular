import { SpeechRecognitionService } from './../speech-recognition.service';
import { TodoListData } from './../dataTypes/TodoListData';
import { ChangeDetectionStrategy, Component, Input, OnInit, ViewChild, ElementRef, OnDestroy, EventEmitter } from '@angular/core';
import { TodoItemData } from '../dataTypes/TodoItemData';
import { TodoService } from '../todo.service';


@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoListComponent implements OnInit,OnDestroy {

  showSearchButton : boolean;
  speechData : string;

  @Input()
  @ViewChild('newTodoInput', {static:false}) todoInput:any;

  private data: TodoListData; //Current item of the TodoList 
  futur: Array<{todo: TodoItemData}> = [];
  private titre: string;
  private filtre: string = 'all';  //Used to see which elements must be seen either 'completed', 'active' or 'all'

  constructor(private todoService: TodoService , private speechRecognitionService:SpeechRecognitionService) {
    todoService.getTodoListDataObserver().subscribe( tdl => this.data = tdl);
    this.titre = this.data.label;
    this.showSearchButton = true;
    this.speechData = '';
  }

  ngOnInit() {
    //Loads the stored todolist
    this.loadTodoListLocal();

    //Update data each time the todolist changes
    this.todoService.getTodoListDataObserver().subscribe(todolist=>{
      //Retrieve the todolist data
      this.data = todolist;

      //Save the todolist in local storage
      this.saveTodoListLocal();
    });
    this.todoService.clearHistory();
  }

  ngOnDestroy(){
    this.speechRecognitionService.DestroySpeechObject();
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
    if(label.length!=0)
    {
      this.todoService.appendItems(
        { label, isDone: false}
      );
    this.todoInput.nativeElement.value = "";
    }
  //Get rid of the text when we enter a new object
  //this.redel.nativeElement.value="";
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
    for(let Data in this.data.items)
    {
      if(this.data.items[Data].isDone)
      {
        this.todoService.removeLocalStorage(this.data.items[Data]);
        this.removeItem(this.data.items[Data]);
        this.deleteDone();
        break;
      }
    }
  }

  /**
   * 
   */
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

  /**
   * Check if undo is possible if so save the current in a array for the redo and display the latest update from before, and delete this update from the array
   */
  undo()
  {
    //Si aucun Undo n'est possible le bouton Undo ne fait rien
    if(this.todoService.nbUndo <0)
    {
      let lengthVoulu = this.todoService.empList.length;
      lengthVoulu = lengthVoulu -1;
      if(this.todoService.empList!=null)
      {
        this.saveCurrent();
        this.deleteAll();
      }

      for(let Data in this.todoService.empList[lengthVoulu])
      {
        this.todoService.appendItemsSpecial(this.todoService.empList[lengthVoulu][Data]);
      }
      //On met à jour les différents compteurs
      this.todoService.nbUndo+=1;
      this.todoService.nbRedo-=1;
      this.todoService.empList.pop();
    }
  }

  /**
   * Check if we can redo if possible save the current todoList, delete the TodoList and display the last update, modify the redo,undo comptor and delete the last update from the data base
   */
  redo()
  {
    if(this.todoService.nbRedo <0)
    {
      this.todoService.putInReserve(this.data);
      this.deleteAll();
      let lengthVoulu = this.todoService.future.length;
      lengthVoulu = lengthVoulu-1;
      for(let Data in this.todoService.future[lengthVoulu])
      {
        this.todoService.appendItemsSpecial(this.todoService.future[lengthVoulu][Data]);
      }
      this.todoService.nbRedo+=1;
      this.todoService.nbUndo-=1;
      this.todoService.future.pop();
    }
  }

  /**
   * Loads the todolist in localstorage
   */
  loadTodoListLocal(){
    if(localStorage.getItem('todolist')){
      let localList:TodoListData = JSON.parse(localStorage.getItem('todolist'));
      this.todoService.setItemsLabel(localList.label);
      localList.items.forEach(item=>{
        this.todoService.appendItems(item);
      });  
    }
  }

  /**
   * Save the todolist in localstorage
   */
  saveTodoListLocal(){
    localStorage.setItem('todolist', JSON.stringify(this.data));
  }

  /**
   * Call the todoService in order to update the localStorage by sending the renamed todo
   * @param item 
   */
  rename(item: TodoItemData)
  {
    this.todoService.setItemsLabel(item.label, item);
  }

  /**
   * Display the text said by the user but it doesn't add it to the todolist yet
   */
  activateSpeechSearchMovie(): void {
    this.showSearchButton = false;
    this.speechRecognitionService.record()
        .subscribe(
        //listener
        (value) => {
            this.speechData = value;
            console.log('La valeur du speechData :  ',value);
        },
        //errror
        (err) => {
            console.log(err);
            if (err.error == "no-speech") {
                console.log("--restatring service--");
                this.activateSpeechSearchMovie();
            }
        },
        //completion
        () => {
            this.showSearchButton = true;
            console.log("--complete--");
            this.activateSpeechSearchMovie();
        });
      
}
}
