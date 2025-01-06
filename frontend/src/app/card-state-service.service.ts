import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CardStateService {
  private activeCardId: string | null = null;

  isCardInUse(cardId: string): boolean {
    return this.activeCardId === cardId;
  }

  setCardInUse(cardId: string): void {
    this.activeCardId = cardId;
  }

  clearCardInUse(): void {
    this.activeCardId = null;
  }
}
