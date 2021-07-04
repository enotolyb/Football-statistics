import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LeaguesResponse } from '../interfaces/leagues-response';
import { environment } from '../../environments/environment';
import { ApiService } from './api.service';

const AREA_EUROPE = 2077;

@Injectable({
  providedIn: 'root'
})
export class LeagueListService {
  constructor(
    private api: ApiService,
  ) {
  }

  getLeagues(): Observable<LeaguesResponse> {
    return this.api.get<LeaguesResponse>(environment.apiFootball + 'competitions', {
      areas: AREA_EUROPE
    });
  }
}
