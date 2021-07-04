import { Routes, Router, RouterModule, ActivatedRoute } from '@angular/router';
import { TeamListComponent } from './pages/team-list/team-list.component';
import { LeagueCalendarComponent } from './pages/league-calendar/league-calendar.component';
import { LeagueListComponent } from './pages/league-list/league-list.component';
import { TeamCalendarComponent } from './pages/team-calendar/team-calendar.component';
import { NgModule, OnInit } from '@angular/core';
const appRoutes: Routes = [
  { path: 'leagues/:id', component: LeagueCalendarComponent},
  { path: 'leagues', component: LeagueListComponent },
  { path: 'teams', component: TeamListComponent},
  { path: 'teams/:id', component: TeamCalendarComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class MenuRouterModule {
}
