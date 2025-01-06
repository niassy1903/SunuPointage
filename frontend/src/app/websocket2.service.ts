import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { webSocket } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService2 {
  private socket$: Observable<any>;

  constructor() {
    this.socket$ = webSocket('ws://localhost:8081');
  }

  getMessages(): Observable<any> {
    return this.socket$;
  }
}
