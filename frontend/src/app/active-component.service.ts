import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActiveComponentService {
  private activeComponent = new BehaviorSubject<string | null>(null);
  activeComponent$ = this.activeComponent.asObservable();

  private cardId = new BehaviorSubject<string | null>(null);
  cardId$ = this.cardId.asObservable();

  setActiveComponent(componentName: string | null) {
    this.activeComponent.next(componentName);
  }

  getActiveComponent(): string | null {
    return this.activeComponent.value;
  }

  setCardId(cardId: string | null) {
    this.cardId.next(cardId);
  }
}
