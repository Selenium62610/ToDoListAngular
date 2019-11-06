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

  setItemsDone(isDone: boolean, ...items: TodoItemData[] ) {
    const tdl = this.todoListSubject.getValue();
    this.todoListSubject.next( {
      label: tdl.label,
      items: tdl.items.map( I => items.indexOf(I) === -1 ? I : ({label: I.label, isDone}) )
    });
  }

  //addToLocal storage
  addToLocal(items: TodoItemData[])
  {
    localStorage.setItem(items[0].label , JSON.stringify(items));
  }
  
  removeLocalStorage(items)
  {
    console.log("je recois un : ", items);
    console.log("Coucou je dois enlever : " , items.label );
    localStorage.removeItem(items.label);
  }

//Ajoute un objet à la todoItempDate []
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
    console.log("Le tdl après rundo : ",tdl);
  }

  checkToDoListSubject()
  {

  }

  removeItems( ...items: TodoItemData[] ) {
    const tdl = this.todoListSubject.getValue();
    console.log(items);
    this.removeLocalStorage(items[0]);
    this.todoListSubject.next( {
      label: tdl.label, // ou on peut écrire: ...tdl,
      items: tdl.items.filter( I => items.indexOf(I) === -1 )
    });
  }

}
