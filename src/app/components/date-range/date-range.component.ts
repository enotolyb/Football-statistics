import { Component, forwardRef, OnInit } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import * as moment from 'moment';
import { DateRange } from '../../interfaces/date-range';
import { filter } from 'rxjs/operators';

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD.MM.YYYY',
    monthYearLabel: 'DD MM YYYY',
    dateA11yLabel: 'DD MM YYYY',
    monthYearA11yLabel: 'DD MM YYYY',
  },
};

interface DateRangeControls {
  start: moment.Moment | null;
  end: moment.Moment | null;
}

@Component({
  selector: 'app-date-range',
  templateUrl: './date-range.component.html',
  styleUrls: ['./date-range.component.scss'],
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
      useExisting: forwardRef(() => DateRangeComponent),
      multi: true
    },
  ],
})
export class DateRangeComponent implements OnInit, ControlValueAccessor {
  formDateRange: FormGroup;

  private onChange: (_: DateRange) => void;

  ngOnInit() {
    this.formDateRange = new FormGroup({
      start: new FormControl(),
      end: new FormControl()
    });

    this.formDateRange.valueChanges.pipe(
      filter(() => !!this.onChange),
    ).subscribe((value: DateRangeControls) => {
      this.onChange({
        from: value?.start?.format('yyyy-MM-DD'),
        to: value?.end?.format('yyyy-MM-DD'),
      });
    });
  }

  writeValue(value: DateRange | null) {
    this.formDateRange.patchValue({
      start: value ? moment(value.from) : null,
      end: value ? moment(value.to) : null
    });
  }

  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched() {
  }
}
