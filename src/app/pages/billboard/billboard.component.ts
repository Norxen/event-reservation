import { ChangeDetectionStrategy, Component } from '@angular/core';
import { EventListComponent } from './components/event-list/event-list.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-billboard',
  standalone: true,
  imports: [EventListComponent, CommonModule],
  templateUrl: './billboard.component.html',
  styleUrl: './billboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BillboardComponent {}
