import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {FormDescriptor} from "../../models/form-descriptor";
import {DatasetService} from "../../services/dataset/dataset.service";
import {FormGeneratorService} from "../../services/form-generator/form-generator.service";
import {AsyncPipe, JsonPipe, NgForOf, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault} from "@angular/common";
import {BehaviorSubject, combineLatest, map, Observable, shareReplay, Subscription} from "rxjs";
import {Dataset} from "../../models/dataset";
import {tap} from "rxjs/operators";
import {DateFieldComponent} from "../date-field/date-field.component";
import {IntegerFieldComponent} from "../integer-field/integer-field.component";
import {NumberFieldComponent} from "../number-field/number-field.component";
import {TextFieldComponent} from "../text-field/text-field.component";
import {SelectFieldComponent} from "../select-field/select-field.component";
import {FieldComponent} from "../field/field.component";
import {HiddenFieldComponent} from "../hidden-field/hidden-field.component";
import {LocationSelectorComponent} from "../location-selector/location-selector.component";
import {ActiveRecordService} from "../../services/active-record/active-record.service";
import {IonItem, IonItemDivider, IonItemGroup, IonList} from "@ionic/angular/standalone";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faCalendar, faStar} from "@fortawesome/free-regular-svg-icons";
import {faAsterisk} from "@fortawesome/free-solid-svg-icons";
import {ClientRecord} from "../../models/client-record";
import {RecordsService} from "../../services/records/records.service";
import * as dayjs from "dayjs";
import {AuthenticationService} from "../../services/authentication/authentication.service";

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
    FaIconComponent,
  ]
})
export class RecordFormComponent implements OnInit, OnChanges {

  public faCalendar = faCalendar;
  public faStar = faStar;
  public faAsterisk = faAsterisk;

  @Input()
  dataset: string = "";

  @Input()
  countField?: string;

  @Input()
  dateField?: string;

  @Output()
  onDirty = new EventEmitter<boolean>();

  form: FormGroup;
  fields?: FormDescriptor;

  _datasetName = new BehaviorSubject<string>("");
  _dataset?: Dataset;
  dataset$: Observable<Dataset | undefined>;
  record$: Observable<ClientRecord | undefined>;
  subscriptions: Subscription[] = [];
  clientId: string = "";

  readonly: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private datasetService: DatasetService,
    private formGeneratorService: FormGeneratorService,
    private activeRecordService: ActiveRecordService,
    private recordsService: RecordsService,
    private authenticationService: AuthenticationService,
  ) {
    this.form = this.formBuilder.group({});
    this.dataset$ = combineLatest([
      this._datasetName.asObservable(),
      this.datasetService.datasets$,
    ]).pipe(
      map(([datasetName, datasets]) => datasets.find(d => d.name === datasetName)),
      shareReplay(1),
      tap((dataset) => {
        if (dataset) {
          this._dataset = dataset;
        }
      }),
    );

    this.record$ = combineLatest([
      this.dataset$,
      this.activeRecordService.record$,
      this.authenticationService.user$,
    ]).pipe(
      tap(([dataset, record, user]) => {
        if (record && this.clientId === record.client_id) return;
        if (this.subscriptions.length) {
          this.subscriptions.forEach(sub => sub.unsubscribe());
          this.subscriptions = [];
        }

        this.form = this.formBuilder.group({});
        this.fields = undefined;
        if (!dataset || !user) return;

        if (!record.dataset || !record.datasetName) {
          this.activeRecordService.setValues({
            dataset: dataset.id,
            datasetName: dataset.name,
          })
          return;
        }

        this.readonly = !!record.id;
        this.clientId = record.client_id;
        const values = record?.data || {};
        this.form = this.formGeneratorService.getFormGroup(this.formBuilder, values, dataset, user);
        this.fields = this.formGeneratorService.getFormFields(dataset, values, user);
        this.subscriptions = [
          this.form.valueChanges.subscribe((values) => this.valueChanges(values)),
          this.form.statusChanges.subscribe(value => this.statusChanges(value)),
        ];
      }),
      map(([_dataset, record, _user]) => record),
      shareReplay(1),
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
    const record: any = {
      dataset: this._dataset?.id,
      datasetName: this._dataset?.name,
      data: values,
      count: 0,
      valid: this.form.valid,
      modified: this.form.dirty,
    }

    // Default behaviour of count callback is how many child records exist.
    if (this.countField && values.hasOwnProperty(this.countField)) {
      record.count = values[this.countField] ? parseInt(values[this.countField], 10) : 0;
    } else {
      const clientId = this.activeRecordService.getClientId();
      const records = this.recordsService.getChildRecords(clientId);
      record.count = records.length;
      record.valid = record.valid && !records.some(record => !record.valid);
    }

    if (this.dateField && values.hasOwnProperty(this.dateField)) {
      record.datetime = dayjs(values[this.dateField]).format();
    }

    this.activeRecordService.setValues(record);

    this.onDirty.emit(this.form.dirty);
  }

  statusChanges(value: string) {
    this.activeRecordService.setStatus(value);
  }

}
