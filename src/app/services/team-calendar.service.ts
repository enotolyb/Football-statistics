import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CalendarOfTeamsResponse } from '../interfaces/calendar-of-teams-response';
import { ApiService } from './api.service';
import { environment } from '../../environments/environment';
import { DateRange } from '../interfaces/date-range';

@Injectable({
  providedIn: 'root'
})
export class TeamCalendarService {
  constructor(
    private api: ApiService,
  ) {
  }

  getTeamCalendar(id: number, dateRange: DateRange): Observable<CalendarOfTeamsResponse> {
    return this.api.get<CalendarOfTeamsResponse>(environment.apiFootball + `teams/${id}/matches/`, {
      dateFrom: dateRange.from,
      dateTo: dateRange.to
    });
  }
}
