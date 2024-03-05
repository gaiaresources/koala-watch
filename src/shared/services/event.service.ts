import {Injectable} from "@angular/core";
import {filter as _filter, Observable, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private eventSubject = new Subject<Event>()

    publishEvent(event: string) {
        this.eventSubject.next({ id: 'event', data: event })
    }

  publish(filter: string, data: any) {
      this.eventSubject.next({ id: filter, data: data })
  }

  getObservableForEvent(event: string): Observable<Event> {
    return this.eventSubject.pipe(
      _filter(_event => _event.id == 'event' && _event.data == event)
    )
  }
}

export class Event {
    id: string
    data: any
}
