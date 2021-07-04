import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { combineLatest, Observable } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, filter, map, shareReplay, startWith, switchMap } from 'rxjs/operators';
import { LeagueCalendarService } from '../../services/league-calendar.service';
import { CalendarOfLeague } from '../../interfaces/calendar-of-league';
import { DateRange } from '../../interfaces/date-range';

const DEFAULT_DATE_RANGE: DateRange = {
  from: '2020-01-01',
  to: '2021-07-01'
};

@Component({
  selector: 'app-league-calendar',
  templateUrl: './league-calendar.component.html',
  styleUrls: ['./league-calendar.component.scss']
})
export class LeagueCalendarComponent implements OnInit {
  displayedColumns: string[] = ['date', 'name', 'country', 'calendar'];
  dataSource: MatTableDataSource<CalendarOfLeague>;
  list$: Observable<CalendarOfLeague[]>;

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  private form: FormGroup;

  constructor(
    private calendarLeagueService: LeagueCalendarService,
    private activatedRouter: ActivatedRoute,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(),
      dateRange: new FormControl()
    });

    this.form.patchValue({
      dateRange: DEFAULT_DATE_RANGE,
      ...this.unSerializeParams(this.activatedRouter.snapshot.queryParams)
    });

    const form$ = this.form.valueChanges.pipe(
      startWith(this.unSerializeParams(this.activatedRouter.snapshot.queryParams)),
    );

    form$.subscribe(form => this.router.navigate([], {
      queryParams: this.serializeParams(form),
    }));

    const apiList$ = combineLatest(
      this.form.get('dateRange').valueChanges.pipe(
        filter(dateRange => !!dateRange?.from && !!dateRange?.to),
        startWith(this.form.getRawValue().dateRange)
      ),
      this.activatedRouter.params,
    ).pipe(
      switchMap(([dateRange, params]) => this.calendarLeagueService.getLeagueCalendar(params.id, dateRange)),
      catchError(error => {
        console.error(error);
        return [];
      }),
    );

    this.list$ = combineLatest(
      apiList$,
      form$,
    ).pipe(
      map(([response, form]) => {
        const filterString = form.name ? form.name.trim().toLowerCase() : null;
        return response.matches
          .filter(item => !filterString ? true
            : (this.checkIncludes(item.homeTeam.name, filterString)
              || this.checkIncludes(item.awayTeam.name, filterString))
          );
      }),
      shareReplay(1),
    );

    this.list$.subscribe(list => {
      this.dataSource = new MatTableDataSource(list);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  private checkIncludes(origin: string, needly: string): boolean {
    return origin.toLowerCase().includes(needly);
  }

  private serializeParams(params) {
    return Object.entries(params)
      .filter(([_, value]) => !!value)
      .reduce((object, [key, value]) => {
        return {...object, [key]: JSON.stringify(value)};
      }, {});
  }

  private unSerializeParams(params) {
    return Object.entries(params)
      .filter(([_, value]) => !!value)
      .reduce((object, [key, value]) => {
        return {...object, [key]: JSON.parse(value as string)};
      }, {});
  }
}
