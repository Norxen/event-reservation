import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { EventI } from '../interfaces/event.interface';
import { EventInfoI, EventSessionI } from '../interfaces/event-info.interface';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private baseUrl = 'assets/data/';

  constructor(private http: HttpClient) {}

  getEvents(): Observable<EventI[]> {
    return this.http
      .get<EventI[]>(this.baseUrl + 'events.json')
      .pipe(
        map((events) =>
          events.sort((a, b) => Number(a.endDate) - Number(b.endDate))
        )
      );
  }
  getEventInfo(id: number): Observable<EventInfoI> {
    const url = this.baseUrl + `event-info-${id}.json`;
    return this.http.get<any>(url).pipe(
      map((data) => ({
        id: Number(data.event.id),
        title: data.event.title,
        subtitle: data.event.subtitle,
        image: data.event.image,
        sessions: data.sessions
          .map((session: EventSessionI) => ({
            date: session.date,
            availability: Number(session.availability),
            selected: 0,
          }))
          .sort(
            (a: EventSessionI, b: EventSessionI) =>
              Number(a.date) - Number(b.date)
          ),
      }))
    );
  }
}
