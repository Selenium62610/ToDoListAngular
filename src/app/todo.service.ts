import { Injectable } from '@angular/core';
import {TodoListData} from './dataTypes/TodoListData';
import {Observable, BehaviorSubject} from 'rxjs';
import {TodoItemData} from './dataTypes/TodoItemData';

@Injectable()
export class TodoService {
  empList: Array<{todo: TodoItemData}> = [];
  future: Array<{todo: TodoItemData}> = [];
  private todoListSubject = new BehaviorSubject<TodoListData>( {label: 'TodoList', items: []} );
  constructor() { }

  getTodoListDataObserver(): Observable<TodoListData> {
    return this.todoListSubject.asObservable();
  }

  getToDoListSubject()
  {
    return this.todoListSubject.value.items;
  }

  setItemsLabel(label: string, ...items: TodoItemData[] ) {
    const tdl = this.todoListSubject.getValue();
    this.todoListSubject.next( {
      label: tdl.label,
      items: tdl.items.map( I => items.indexOf(I) === -1 ? I : ({label, isDone: I.isDone}) )
    });
  }

  /**
   * Set an item to the selected state
   * @param isDone
   * @param items
  */
  setItemsDone(isDone: boolean, ...items: TodoItemData[] ) {
    const tdl = this.todoListSubject.getValue();
    this.todoListSubject.next( {
      label: tdl.label,
      items: tdl.items.map( I => items.indexOf(I) === -1 ? I : ({label: I.label, isDone}) )
    });
  }

  /**
   * Add an item to the LocalStorage with it's label as key 
  */
  addToLocal(items: TodoItemData[])
  {
    localStorage.setItem(items[0].label , JSON.stringify(items));
  }
  

  /**
   * Delete an item from the LocalStorage using it's key to find it back
   * @param items
  */
  removeLocalStorage(items)
  {
    localStorage.removeItem(items.label);
  }

  /**
   * Add an item to the TodoItemData and to the list in order to undo
  */
  appendItems( ...items: TodoItemData[] ) {
  if(this.todoListSubject.value.items.length != 0)
    {
      this.empList.push(this.todoListSubject.value.items);
    }
    const tdl = this.todoListSubject.getValue();
    this.todoListSubject.next( {
      label: tdl.label, // ou on peut écrire: ...tdl,
      items: [...tdl.items, ...items]      
    });
    this.addToLocal(items);
  }

  /**
   * Add the current items to the future List
  */
  appendFutur(...items: TodoItemData[]){
    if(this.todoListSubject.value.items.length != 0)
    {
      this.future.push(this.todoListSubject.value.items);
      console.log("Ce qu'il y'a dans this.future dans appendFutur : ", this.future );
    }
  }

  rundo(...items: TodoItemData[] ) {
    const tdl = this.todoListSubject.getValue();
    this.todoListSubject.next( {
      label: tdl.label, // ou on peut écrire: ...tdl,
      items: [...tdl.items, ...items]
    });
  }

  checkToDoListSubject()
  {

  }

  removeItems( ...items: TodoItemData[] ) {
    const tdl = this.todoListSubject.getValue();
    this.removeLocalStorage(items[0]);
    this.todoListSubject.next( {
      label: tdl.label, // ou on peut écrire: ...tdl,
      items: tdl.items.filter( I => items.indexOf(I) === -1 )
    });
  }

}
