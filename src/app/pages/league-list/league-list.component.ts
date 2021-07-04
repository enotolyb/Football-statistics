import { Component, OnInit, ViewChild } from '@angular/core';
import { League } from '../../interfaces/league';
import { LeagueListService } from '../../services/league-list.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { combineLatest, Observable } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';
import { map, shareReplay, startWith } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

const DEFAULT_DATE = '2021';

@Component({
  selector: 'app-list-of-books',
  templateUrl: './league-list.component.html',
  styleUrls: ['./league-list.component.scss']
})
export class LeagueListComponent implements OnInit {

  displayedColumns: string[] = ['name', 'country', 'calendar'];
  dataSource: MatTableDataSource<League>;
  list$: Observable<League[]>;

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  private form: FormGroup;

  constructor(private listLeaguesService: LeagueListService,
              private activatedRouter: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(),
      year: new FormControl()
    });

    this.form.patchValue({
      year: DEFAULT_DATE,
      ...this.unSerializeParams(this.activatedRouter.snapshot.queryParams)
    });

    const form$ = this.form.valueChanges.pipe(
      startWith(this.form.getRawValue()),
    );

    form$.subscribe(form => this.router.navigate([], {
      queryParams: this.serializeParams(form),
    }));

    this.list$ = combineLatest(
      this.listLeaguesService.getLeagues(),
      form$,
    ).pipe(
      map(([response, form]) => {
        const filterString = form?.name ? form.name.trim().toLowerCase() : null;
        return response.competitions
          .filter(item => !filterString ? true : item.name.toLowerCase().includes(filterString))
          .filter(item => !form.year
            ? true
            : parseInt(item?.currentSeason?.startDate, 0) === parseInt(form.year, 0));
      }),
      shareReplay(1),
    );

    this.list$.subscribe(list => {
      this.dataSource = new MatTableDataSource(list);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
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
