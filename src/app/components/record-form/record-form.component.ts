import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { FormDescriptor } from "../../models/form-descriptor";
import { DatasetService } from "../../services/dataset/dataset.service";
import { FormGeneratorService } from "../../services/form-generator/form-generator.service";
import { AsyncPipe, JsonPipe, NgForOf, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault } from "@angular/common";
import { BehaviorSubject, combineLatest, map, Observable, Subscription } from "rxjs";
import { Dataset } from "../../models/dataset";
import { tap } from "rxjs/operators";
import { IonicModule } from "@ionic/angular";
import { DateFieldComponent } from "../date-field/date-field.component";
import { IntegerFieldComponent } from "../integer-field/integer-field.component";
import { NumberFieldComponent } from "../number-field/number-field.component";
import { TextFieldComponent } from "../text-field/text-field.component";
import { SelectFieldComponent } from "../select-field/select-field.component";
import { FieldComponent } from "../field/field.component";
import { HiddenFieldComponent } from "../hidden-field/hidden-field.component";
import { LocationSelectorComponent } from "../location-selector/location-selector.component";
import { ActiveRecordService } from "../../services/active-record/active-record.service";
import { IonItem, IonItemDivider, IonItemGroup, IonList } from "@ionic/angular/standalone";

@Component({
  standalone: true,
  selector: 'app-record-form',
  templateUrl: './record-form.component.html',
  styleUrls: ['./record-form.component.scss'],
  imports: [
    JsonPipe,
    NgIf,
    AsyncPipe,
    NgForOf,
    DateFieldComponent,
    IntegerFieldComponent,
    NgSwitchCase,
    NgSwitch,
    NumberFieldComponent,
    TextFieldComponent,
    NgSwitchDefault,
    SelectFieldComponent,
    FieldComponent,
    HiddenFieldComponent,
    LocationSelectorComponent,
    ReactiveFormsModule,
    IonList,
    IonItem,
    IonItemGroup,
    IonItemDivider,
  ]
})
export class RecordFormComponent implements OnInit, OnChanges {

  @Input()
  readonly: boolean = false;

  @Input()
  dataset: string = "";

  form: FormGroup;
  fields?: FormDescriptor;

  _datasetName = new BehaviorSubject<string>("");
  dataset$: Observable<Dataset | undefined>;
  subscriptions: Subscription[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private datasetService: DatasetService,
    private formGeneratorService: FormGeneratorService,
    private activeRecordService: ActiveRecordService,
  ) {
    this.form = this.formBuilder.group({});
    this.dataset$ = combineLatest([
      this._datasetName.asObservable(),
      this.datasetService.datasets$,
    ]).pipe(
      map(([datasetName, datasets]) => datasets.find(d => d.name === datasetName)),
      tap((dataset) => {
        if (this.subscriptions.length) {
          this.subscriptions.forEach(sub => sub.unsubscribe());
          this.subscriptions = [];
        }

        this.form = this.formBuilder.group({});
        this.fields = undefined;
        if (!dataset) return;

        const values = this.activeRecordService.getValues();
        this.form = this.formGeneratorService.getFormGroup(this.formBuilder, values, dataset);
        this.fields = this.formGeneratorService.getFormFields(dataset);
        this.subscriptions = [
          this.form.valueChanges.subscribe((values) => this.valueChanges(values)),
          this.form.statusChanges.subscribe(value => this.statusChanges(value)),
        ];
      }),
    );
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['dataset']) {
      this._datasetName.next(this.dataset);
    }
  }

  valueChanges(values: any) {
    this.activeRecordService.setValues(values);
  }

  statusChanges(value: string) {
    this.activeRecordService.setStatus(value);
  }

}
