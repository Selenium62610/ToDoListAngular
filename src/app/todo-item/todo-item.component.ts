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

  @Input() private data: TodoItemData; //present TodoList
  @Output() checkAction = new EventEmitter();   //event emitted when item is checked

  public showEdit:boolean = false;  //true: show the edit input

  constructor(private todoService: TodoService) { }

  ngOnInit() {
  }

  get label():string {
    return this.data.label;
  }

  remove(): void
  {
    this.todoService.removeItems(this.data);
  }

  datadone(event: boolean): void
  {
    this.todoService.setItemsDone(event, this.data);
  }

}
