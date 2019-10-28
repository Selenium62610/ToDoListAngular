import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {TodoListData} from '../dataTypes/TodoListData';
import {TodoItemData} from '../dataTypes/TodoItemData';
import {TodoService} from '../todo.service';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoListComponent implements OnInit {

  @Input()
  private data: TodoListData;
  private titre: string;
  private filtre: string = 'all';  //Used to see which elements must be seen either 'completed', 'active' or 'all'


  constructor(private todoService: TodoService) {
    todoService.getTodoListDataObserver().subscribe( tdl => this.data = tdl);
    this.titre = this.data.label;
  }

  ngOnInit() {
  }

  get label(): string {
    return this.data ? this.data.label : '';
  }

  get items(): TodoItemData[] {
    return this.data ? this.data.items : [];
  }

  appendItem(label: string) {
    this.todoService.appendItems(
      { label, isDone: false}
    );
  }

  itemDone(item: TodoItemData, done: boolean){
    this.todoService.setItemsDone(done, item);
  }

  itemLabel(item: TodoItemData, label: string){
    this.todoService.setItemsLabel(label, item);
  }

  removeItem(item: TodoItemData){
    this.todoService.removeItems(item);
  }

  checkItem(item: TodoItemData){
    this.todoService.setItemsDone(!item.isDone, item);
  }



  //Changes the filter value @param value filter value 
  show(value){
    console.log("On me clique dessu");
    this.filtre = value;
  }

  countItemsLeft():number{
    return (this.data.items.length - this.data.items.filter(item=>item.isDone).length);
  }

  //Delete the selected item from data
  deleteDone():void{
    for(let Data in this.data.items)
    {
      if(this.data.items[Data].isDone)
      {
      this.removeItem(this.data.items[Data]);
      this.deleteDone();
      break;
      }
  }
} 

  /**
   * Checks if an item is in the filters
   * @param data
   */
  isItemShown(data){
    console.log(this.filtre);
    console.log("les data ", data)
    console.log("data.isDone???",data.isDone)
    if(this.filtre==='all'){
      console.log("Il est true le all");
      return true;
    }
    
    if(this.filtre==='actives' && !data.isDone){
      console.log("Il est true le activé");
      return true;
    }

    if(this.filtre==='completed' && data.isDone){
      console.log("Il est true le complet");
      return true;
    }

    return false;
  }

  

}