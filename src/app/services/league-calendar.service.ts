import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { environment } from '../../environments/environment';
import { DateRange } from '../interfaces/date-range';
import { CalendarOfLeagueResponse } from '../interfaces/calendar-of-league-response';


@Injectable({
  providedIn: 'root'
})
export class LeagueCalendarService {
  constructor(
    private api: ApiService,
  ) {
  }

  getLeagueCalendar(id: number, dateRange: DateRange): Observable<CalendarOfLeagueResponse> {
    return this.api.get<CalendarOfLeagueResponse>(environment.apiFootball + `competitions/${id}/matches/`, {
      dateFrom: dateRange.from,
      dateTo: dateRange.to
    });
  }
}
