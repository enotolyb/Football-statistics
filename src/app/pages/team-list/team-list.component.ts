import { Component, OnInit, ViewChild } from '@angular/core';
import { Team } from '../../interfaces/team';
import { TeamListService } from '../../services/team-list.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormControl, FormGroup } from '@angular/forms';
import { map, shareReplay, startWith } from 'rxjs/operators';
import { combineLatest, Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-list-teams',
  templateUrl: './team-list.component.html',
  styleUrls: ['./team-list.component.scss'],
})

export class TeamListComponent implements OnInit {
  displayedColumns: string[] = ['founded', 'name', 'country', 'calendar'];
  dataSource: MatTableDataSource<Team>;
  list$: Observable<Team[]>;
  form: FormGroup;

  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;

  constructor(private listTeamsService: TeamListService,
              private activatedRouter: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(),
      year: new FormControl()
    });

    const form$ = this.form.valueChanges.pipe(
      startWith({}),
    );

    form$.subscribe(form => this.router.navigate([], {
      queryParams: this.serializeParams(form),
    }));

    this.list$ = combineLatest(
      this.listTeamsService.getTeams(),
      form$,
    ).pipe(
      map(([response, form]) => {
        const filterString = form?.name ? form.name.trim().toLowerCase() : null;
        return response.teams
          .filter(item => !filterString ? true : item.name.toLowerCase().includes(filterString))
          .filter(item => !form.year
            ? true
            : item?.founded === parseInt(form.year, 0));
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
