import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { CartService } from '../../../../core/services/cart-service/cart.service';
import {
  EventInfoI,
  EventSessionI,
} from '../../../../core/services/interfaces/event-info.interface';
import { CartItem } from '../../../../core/services/interfaces/cart.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-session-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './session-list.component.html',
  styleUrl: './session-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionListComponent implements OnInit, OnDestroy, OnChanges {
  @Input() eventInfo: EventInfoI | null = null;
  cartItems: CartItem[] = [];
  private cartSubscription!: Subscription;

  constructor(public cartService: CartService, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.cartSubscription = this.cartService.cart$.subscribe((items) => {
      this.cartItems = items;
      this.updateSessionSelections();
      // Mark for check since we're using OnPush
      this.cd.markForCheck();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['eventInfo']) {
      this.updateSessionSelections();
      this.cd.markForCheck();
    }
  }

  private updateSessionSelections(): void {
    if (!this.eventInfo) {
      return;
    }
    this.eventInfo.sessions.forEach((session) => {
      const matchingCartItem = this.cartItems.find(
        (item) =>
          item.eventId === this.eventInfo!.id &&
          item.sessionDate === session.date
      );
      session.selected = matchingCartItem ? matchingCartItem.quantity : 0;
    });
  }

  get getSessions(): EventSessionI[] {
    if (!this.eventInfo) {
      return [];
    }
    return this.eventInfo.sessions.slice();
  }

  increment(session: EventSessionI): void {
    if (!this.eventInfo) {
      return;
    }
    if ((session.selected || 0) < session.availability) {
      session.selected = (session.selected || 0) + 1;
      this.cartService.addItem({
        eventId: this.eventInfo.id,
        eventTitle: this.eventInfo.title,
        sessionDate: session.date,
        quantity: 1,
      });
    }
  }

  decrement(session: EventSessionI): void {
    if (!this.eventInfo) {
      return;
    }
    if ((session.selected || 0) > 0) {
      session.selected = (session.selected || 0) - 1;
      this.cartService.removeItem(this.eventInfo.id, session.date);
    }
  }

  ngOnDestroy(): void {
    // Unsubscribe to prevent memory leaks
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }
}
