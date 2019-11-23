import { Injectable } from '@angular/core';
import { TodoListData } from './dataTypes/TodoListData';
import { Observable, BehaviorSubject } from 'rxjs';
import { TodoItemData } from './dataTypes/TodoItemData';

@Injectable()
export class TodoService {
  empList: Array<{todo: TodoItemData}> = [];
  future: Array<{todo: TodoItemData}> = [];
  public nbUndo:number=0;
  public nbRedo:number=0;
  private todoListSubject = new BehaviorSubject<TodoListData>( {label: 'TodoList', items: []} );
  constructor() {}

  getTodoListDataObserver(): Observable<TodoListData> {
    return this.todoListSubject.asObservable();
  }
/**
 * 
 * @param label 
 * @param items 
 */
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
   * Add an item to the TodoItemData and to the list in order to undo requestAnimationrame(() => this.input.nativeElement.focus());
   * @param items
   */
  appendItems( ...items: TodoItemData[] ) {
  if(this.todoListSubject.value.items.length != 0)
    {
      this.empList.push(this.todoListSubject.value.items);
      this.nbUndo-=1;
    }
    const tdl = this.todoListSubject.getValue();
    this.todoListSubject.next( {
      label: tdl.label, // ou on peut écrire: ...tdl,
      items: [...tdl.items, ...items]      
    });
  }

  putInReserve(...items: TodoItemData[])
  {
    if(this.todoListSubject.value.items.length != 0)
    {
      this.empList.push(this.todoListSubject.value.items);
    }
    console.log("dans le putInReserve l'empList :", this.empList);
  }

  appendItemsSpecial( ...items: TodoItemData[] ) {
      console.log("appendItemsSpecial");
      const tdl = this.todoListSubject.getValue();
      this.todoListSubject.next( {
        label: tdl.label, // ou on peut écrire: ...tdl,
        items: [...tdl.items, ...items]      
      });
      console.log("Contenu dans empList de appendItemsSpecial: ", this.empList);
  }

  /**
   * Add the current items to the future List
   * @param items
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

  removeItems( ...items: TodoItemData[] ) {
    const tdl = this.todoListSubject.getValue();
    //this.removeLocalStorage(items[0]);
    this.todoListSubject.next( {
      label: tdl.label, // ou on peut écrire: ...tdl,
      items: tdl.items.filter( I => items.indexOf(I) === -1 )
    });
  }

  save()
  {
    const tdl = this.todoListSubject.getValue();
    localStorage.setItem(tdl.label, JSON.stringify(tdl.items));
  }

  clearHistory()
  {
    for(let i=0; i<=this.empList.length; i++)
    {
      this.empList.pop();
    }
  this.nbUndo = 0;
  }

}
