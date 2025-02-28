import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartGroup, CartSession, CartItem } from '../interfaces/cart.interface';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly CART_STORAGE_KEY = 'shoppingCartGroups';

  private cartGroupSubject = new BehaviorSubject<CartGroup[]>(
    this.getCartFromStorage()
  );
  cartGroups$: Observable<CartGroup[]> = this.cartGroupSubject.asObservable();

  constructor() {}

  private getCartFromStorage(): CartGroup[] {
    const storedCart = localStorage.getItem(this.CART_STORAGE_KEY);
    if (storedCart) {
      try {
        return JSON.parse(storedCart);
      } catch (e) {
        console.error('Error parsing cart groups from storage:', e);
      }
    }
    return [];
  }

  private updateStorage(cartGroups: CartGroup[]): void {
    localStorage.setItem(this.CART_STORAGE_KEY, JSON.stringify(cartGroups));
  }

  addItem(item: CartItem): void {
    const currentCartGroups: CartGroup[] = this.cartGroupSubject.getValue();
    const groupIndex: number = currentCartGroups.findIndex(
      (group) => group.eventId === item.eventId
    );

    if (groupIndex >= 0) {
      const group: CartGroup = currentCartGroups[groupIndex];
      const sessionIndex: number = group.sessions.findIndex(
        (s) => s.sessionDate === item.sessionDate
      );
      if (sessionIndex >= 0) {
        group.sessions[sessionIndex].quantity += item.quantity;
      } else {
        group.sessions.push({
          sessionDate: item.sessionDate,
          quantity: item.quantity,
        });
      }
      group.sessions.sort(
        (a, b) => Number(a.sessionDate) - Number(b.sessionDate)
      );
      currentCartGroups[groupIndex] = group;
    } else {
      const newGroup: CartGroup = {
        eventId: item.eventId,
        eventTitle: item.eventTitle,
        sessions: [{ sessionDate: item.sessionDate, quantity: item.quantity }],
      };
      currentCartGroups.push(newGroup);
    }

    currentCartGroups.sort((a, b) => a.eventId - b.eventId);

    this.cartGroupSubject.next([...currentCartGroups]);
    this.updateStorage(currentCartGroups);
  }

  removeItem(eventId: number, sessionDate: string): void {
    let currentCartGroups = this.cartGroupSubject.getValue();

    const groupIndex = currentCartGroups.findIndex(
      (group) => group.eventId === eventId
    );
    if (groupIndex >= 0) {
      const group = currentCartGroups[groupIndex];
      const sessionIndex = group.sessions.findIndex(
        (s) => s.sessionDate === sessionDate
      );
      if (sessionIndex >= 0) {
        group.sessions[sessionIndex].quantity -= 1;
        if (group.sessions[sessionIndex].quantity <= 0) {
          group.sessions.splice(sessionIndex, 1);
        }
        if (group.sessions.length === 0) {
          currentCartGroups.splice(groupIndex, 1);
        } else {
          currentCartGroups[groupIndex] = group;
        }
      }
    }

    this.cartGroupSubject.next([...currentCartGroups]);
    this.updateStorage(currentCartGroups);
  }

  clearCart(): void {
    this.cartGroupSubject.next([]);
    this.updateStorage([]);
  }
}
