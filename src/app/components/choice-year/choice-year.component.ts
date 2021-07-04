import { Component, forwardRef, OnInit } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment from 'moment';
import { Moment } from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';
import { filter } from 'rxjs/operators';

const moment = _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY',
  },
  display: {
    dateInput: 'YYYY',
    dateA11yLabel: 'YYYY',
    yearA11yLabel: 'YYYY',
  },
};

@Component({
  selector: 'app-choice-year',
  templateUrl: './choice-year.component.html',
  styleUrls: ['./choice-year.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {
      provide: MAT_DATE_FORMATS, useValue: MY_FORMATS
    },
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ChoiceYearComponent),
      multi: true
    },
  ],
})
export class ChoiceYearComponent implements OnInit, ControlValueAccessor {
  formControl = new FormControl(moment());

  private onChange: (_: string | null) => void;

  ngOnInit() {
    this.formControl.valueChanges.pipe(
      filter(() => !!this.onChange)
    ).subscribe(
      (value: moment.Moment | null) => {
        this.onChange(
          value?.format('yyyy')
        );
      }
    );
  }

  chosenYearHandler(normalizedYear: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.formControl.value;
    ctrlValue?.year(normalizedYear.year());

    if (this.onChange) {
      this.onChange(
        ctrlValue?.format('yyyy')
      );
    }

    this.formControl.setValue(ctrlValue);
    datepicker.close();
  }

  writeValue(value: string | null) {
    this.formControl.patchValue(value ? moment(value) : moment());
  }

  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched() {
  }

}
