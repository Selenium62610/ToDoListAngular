import { TodoService } from './../todo.service';
import { TodoItemData } from './../dataTypes/TodoItemData';
import { EventEmitter } from '@angular/core';
import {ChangeDetectionStrategy, Component, OnInit, Input, Output} from '@angular/core';

@Component({
  selector: 'app-todo-item',
  templateUrl: './todo-item.component.html',
  styleUrls: ['./todo-item.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoItemComponent implements OnInit {
  
  @Input() data:TodoItemData; //present TodoList
  @Output() checkAction = new EventEmitter();   //event emitted when item is checked
  @Output() renameAction = new EventEmitter();
  

  public showEdit:boolean = false;  //true: show the edit input

  constructor(private todoService: TodoService) { }

  get label():string {
    return this.data.label;
  }

  remove(): void
  {
    console.log("remove");  
    this.todoService.removeItems(this.data);
  }

  datadone(event: boolean): void
  {
    this.todoService.setItemsDone(event, this.data);
  }

  updateLabel()
  {
    this.todoService.save()
  }
}
