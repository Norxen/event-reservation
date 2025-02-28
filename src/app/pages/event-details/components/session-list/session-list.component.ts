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
import {
  BehaviorSubject,
  combineLatest,
  map,
  Observable,
  Subscription,
  take,
} from 'rxjs';
import { CartGroup } from '../../../../core/services/interfaces/cart.interface';

@Component({
  selector: 'app-session-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './session-list.component.html',
  styleUrls: ['./session-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SessionListComponent implements OnDestroy {
  private eventInfoSubject = new BehaviorSubject<EventInfoI | null>(null);

  @Input() set eventInfo(value: EventInfoI | null) {
    this.eventInfoSubject.next(
      value ? { ...value, sessions: [...value.sessions] } : null
    );
  }

  computedEventInfo$: Observable<EventInfoI | null> = combineLatest([
    this.eventInfoSubject.asObservable(),
    this.cartService.cartGroups$,
  ]).pipe(
    map(([eventInfo, groups]) => {
      if (!eventInfo) {
        return null;
      }
      const group = groups.find((g) => g.eventId === eventInfo.id);
      const newSessions = eventInfo.sessions.map((session) => {
        const matchingSession = group
          ? group.sessions.find((s) => s.sessionDate === session.date)
          : null;
        return {
          ...session,
          selected: matchingSession ? matchingSession.quantity : 0,
        };
      });
      return { ...eventInfo, sessions: newSessions };
    })
  );

  constructor(public cartService: CartService) {}

  increment(session: EventSessionI, eventInfo: EventInfoI): void {
    if ((session.selected || 0) < session.availability) {
      this.cartService.addItem({
        eventId: eventInfo.id,
        eventTitle: eventInfo.title,
        sessionDate: session.date,
        quantity: 1,
      });
    }
  }

  decrement(session: EventSessionI, eventInfo: EventInfoI): void {
    if ((session.selected || 0) > 0) {
      this.cartService.removeItem(eventInfo.id, session.date);
    }
  }

  ngOnDestroy(): void {
    this.eventInfoSubject.complete();
  }
}
