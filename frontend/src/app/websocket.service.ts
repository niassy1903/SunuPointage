// websocket.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { webSocket } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket$: Observable<any>;

  constructor() {
    this.socket$ = webSocket('ws://localhost:8080');
  }

  getMessages(): Observable<any> {
    return this.socket$;
  }
}
