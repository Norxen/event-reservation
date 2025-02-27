import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { EventService } from '../../../../core/services/event-service/event.service';
import { EventI } from '../../../../core/services/interfaces/event.interface';
import { EventCardComponent } from '../event-card/event-card.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [EventCardComponent, CommonModule],
  templateUrl: './event-list.component.html',
  styleUrl: './event-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventListComponent {
  events$: Observable<EventI[]> = new Observable<EventI[]>();

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.events$ = this.eventService.getEvents();
  }
}
