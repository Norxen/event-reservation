import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CartService } from '../../core/services/cart-service/cart.service';
import { map } from 'rxjs';
import {
  CartGroup,
  CartSession,
} from '../../core/services/interfaces/cart.interface';
import { EventSessionI } from '../../core/services/interfaces/event-info.interface';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.scss',
})
export class ShoppingCartComponent {
  cartGrouped: CartGroup[] = [];

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.cart$
      .pipe(
        map((items) => {
          const grouped = new Map<
            number,
            { eventTitle: string; eventId: number; sessions: CartSession[] }
          >();

          items.forEach((item) => {
            const newSession = {
              sessionDate: item.sessionDate,
              quantity: item.quantity,
            };

            if (!grouped.has(item.eventId)) {
              grouped.set(item.eventId, {
                eventTitle: item.eventTitle,
                eventId: item.eventId,
                sessions: [newSession],
              });
            } else {
              const group = grouped.get(item.eventId)!;
              const index = group.sessions.findIndex(
                (session) =>
                  Number(session.sessionDate) > Number(newSession.sessionDate)
              );

              if (index === -1) {
                group.sessions.push(newSession);
              } else {
                group.sessions.splice(index, 0, newSession);
              }
            }
          });
          return Array.from(grouped.values());
        })
      )
      .subscribe((grouped) => (this.cartGrouped = grouped));
  }

  removeItem(eventId: number, sessionDate: string): void {
    this.cartService.removeItem(eventId, sessionDate);
  }

  clearCart() {
    this.cartService.clearCart();
  }
}
