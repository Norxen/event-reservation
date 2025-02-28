import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CartService } from '../../core/services/cart-service/cart.service';
import { CartGroup } from '../../core/services/interfaces/cart.interface';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss'],
})
export class ShoppingCartComponent {
  cartGrouped: CartGroup[] = [];

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.cartService.cartGroups$.subscribe((grouped) => {
      this.cartGrouped = grouped;
    });
  }

  removeItem(eventId: number, sessionDate: string): void {
    this.cartService.removeItem(eventId, sessionDate);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }
}
