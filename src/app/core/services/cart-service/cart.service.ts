import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CartItem, CartGroup, CartSession } from '../interfaces/cart.interface';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly CART_STORAGE_KEY = 'shoppingCart';

  private cartSubject = new BehaviorSubject<CartItem[]>(
    this.getCartFromStorage()
  );
  cart$ = this.cartSubject.asObservable();

  cartGroups$: Observable<CartGroup[]> = this.cart$.pipe(
    map((items) => {
      const grouped = new Map<number, CartGroup>();
      items.forEach((item) => {
        const session: CartSession = {
          sessionDate: item.sessionDate,
          quantity: item.quantity,
        };

        if (!grouped.has(item.eventId)) {
          grouped.set(item.eventId, {
            eventId: item.eventId,
            eventTitle: item.eventTitle,
            sessions: [session],
          });
        } else {
          const group = grouped.get(item.eventId)!;
          group.sessions.push(session);
        }

        grouped
          .get(item.eventId)!
          .sessions.sort(
            (a, b) => Number(a.sessionDate) - Number(b.sessionDate)
          );
      });
      return Array.from(grouped.values());
    })
  );

  constructor() {}

  private getCartFromStorage(): CartItem[] {
    const storedCart = localStorage.getItem(this.CART_STORAGE_KEY);
    if (storedCart) {
      try {
        return JSON.parse(storedCart);
      } catch (e) {
        console.error('Error parsing cart from storage:', e);
      }
    }
    return [];
  }

  private updateStorage(cart: CartItem[]): void {
    localStorage.setItem(this.CART_STORAGE_KEY, JSON.stringify(cart));
  }

  addItem(item: CartItem): void {
    const currentCart = this.cartSubject.getValue();
    const existingItemIndex = currentCart.findIndex(
      (e) => e.eventId === item.eventId && e.sessionDate === item.sessionDate
    );

    if (existingItemIndex >= 0) {
      currentCart[existingItemIndex].quantity += item.quantity;
    } else {
      currentCart.push(item);
    }

    currentCart.sort((a, b) => {
      if (a.eventId !== b.eventId) {
        return a.eventId - b.eventId;
      }
      return Number(a.sessionDate) - Number(b.sessionDate);
    });

    this.cartSubject.next([...currentCart]);
    this.updateStorage(currentCart);
  }

  removeItem(eventId: number, sessionDate: string): void {
    let currentCart = this.cartSubject.getValue();
    currentCart = currentCart
      .map((item) => {
        if (item.eventId === eventId && item.sessionDate === sessionDate) {
          return { ...item, quantity: item.quantity - 1 };
        }
        return item;
      })
      .filter((item) => item.quantity > 0);

    this.cartSubject.next(currentCart);
    this.updateStorage(currentCart);
  }

  clearCart(): void {
    this.cartSubject.next([]);
    this.updateStorage([]);
  }
}
