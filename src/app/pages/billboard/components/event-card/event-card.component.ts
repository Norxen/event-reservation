import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { EventI } from '../../../../core/services/interfaces/event.interface';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-event-card',
  standalone: true,
  imports: [MatCardModule, CommonModule, RouterModule, MatButtonModule],
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EventCardComponent {
  @Input() event!: EventI;

  constructor(private router: Router) {}

  goToEvent(id: number) {
    this.router.navigate(['/main', 'event', id]);
  }
}
