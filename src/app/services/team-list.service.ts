import { Injectable } from '@angular/core';
import { TeamsResponse } from '../interfaces/teams-response';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { environment } from '../../environments/environment';

const AREA_EUROPE = 2077;

@Injectable({
  providedIn: 'root'
})
export class TeamListService {
  constructor(
    private api: ApiService,
  ) {
  }

  getTeams(): Observable<TeamsResponse> {
    return this.api.get<TeamsResponse>(environment.apiFootball + 'teams', {
      areas: AREA_EUROPE
    });
  }
}
