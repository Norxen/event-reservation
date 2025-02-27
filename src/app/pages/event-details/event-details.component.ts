import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { BreadcrumbComponent } from '../../shared/breadcrumb/breadcrumb.component';
import { ShoppingCartComponent } from '../../shared/shopping-cart/shopping-cart.component';
import { SessionListComponent } from './components/session-list/session-list.component';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { EventService } from '../../core/services/event-service/event.service';
import { ActivatedRoute } from '@angular/router';
import { EventInfoI } from '../../core/services/interfaces/event-info.interface';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [
    BreadcrumbComponent,
    ShoppingCartComponent,
    SessionListComponent,
    CommonModule,
  ],
  templateUrl: './event-details.component.html',
  styleUrl: './event-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventDetailsComponent implements OnInit {
  eventInfo$!: Observable<EventInfoI>;

  constructor(
    private readonly eventService: EventService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.eventInfo$ = this.eventService.getEventInfo(id);
  }
}
