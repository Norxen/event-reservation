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
import { Subscription, take } from 'rxjs';
import { CartGroup } from '../../../../core/services/interfaces/cart.interface';

@Component({
  selector: 'app-session-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './session-list.component.html',
  styleUrls: ['./session-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionListComponent implements OnInit, OnChanges, OnDestroy {
  @Input() eventInfo: EventInfoI | null = null;
  private cartSubscription!: Subscription;

  constructor(public cartService: CartService, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.cartSubscription = this.cartService.cartGroups$.subscribe(
      (groups: CartGroup[]) => {
        this.updateSelections(groups);
        this.cd.markForCheck();
      }
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['eventInfo']) {
      this.cartService.cartGroups$
        .pipe(take(1))
        .subscribe((groups: CartGroup[]) => {
          this.updateSelections(groups);
          this.cd.markForCheck();
        });
    }
  }

  private updateSelections(groups: CartGroup[]): void {
    if (this.eventInfo) {
      const group = groups.find((g) => g.eventId === this.eventInfo!.id);
      this.eventInfo.sessions.forEach((session: EventSessionI) => {
        const matchingSession = group
          ? group.sessions.find((s) => s.sessionDate === session.date)
          : null;
        session.selected = matchingSession ? matchingSession.quantity : 0;
      });
    }
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
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }
}
