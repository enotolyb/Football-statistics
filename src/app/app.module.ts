import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { MenuComponent } from './components/menu/menu.component';
import { LeagueListComponent } from './pages/league-list/league-list.component';
import { TeamListComponent } from './pages/team-list/team-list.component';
import { LeagueCalendarComponent } from './pages/league-calendar/league-calendar.component';
import { TeamCalendarComponent } from './pages/team-calendar/team-calendar.component';
import { MenuRouterModule } from './menu.module';
import { ChoiceYearComponent } from './components/choice-year/choice-year.component';
import { DateRangeComponent } from './components/date-range/date-range.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    LeagueListComponent,
    TeamListComponent,
    LeagueCalendarComponent,
    TeamCalendarComponent,
    ChoiceYearComponent,
    DateRangeComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MenuRouterModule,
    MatDatepickerModule,
    MomentDateModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatNativeDateModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    HttpClientModule,
    MatCardModule
  ],
  providers: [],
  exports: [
    MenuComponent,
    ChoiceYearComponent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
