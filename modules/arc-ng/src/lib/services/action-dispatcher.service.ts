import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class ActionDispatcherService {

  updateListItem$ = new Subject<__esri.ListItem>();
  toggleAction$ = new Subject<string>();

  updateListItem(item: __esri.ListItem): void {
    this.updateListItem$.next(item);
  }

  toggleAction(actionId: string): void {
    this.toggleAction$.next(actionId);
  }
}
