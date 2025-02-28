import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CartService } from '../../core/services/cart-service/cart.service';
import { CartGroup } from '../../core/services/interfaces/cart.interface';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss'],
})
export class ShoppingCartComponent {
  cartGrouped$: Observable<CartGroup[]> = this.cartService.cartGroups$;

  constructor(private cartService: CartService) {}

  removeItem(eventId: number, sessionDate: string): void {
    this.cartService.removeItem(eventId, sessionDate);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }
}
