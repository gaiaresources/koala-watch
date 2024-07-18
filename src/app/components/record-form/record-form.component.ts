import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {FormDescriptor} from "../../models/form-descriptor";
import {DatasetService} from "../../services/dataset/dataset.service";
import {FormGeneratorService} from "../../services/form-generator/form-generator.service";
import {AsyncPipe, JsonPipe, NgForOf, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault} from "@angular/common";
import {Subscription} from "rxjs";
import {Dataset} from "../../models/dataset";
import {DateFieldComponent} from "../date-field/date-field.component";
import {IntegerFieldComponent} from "../integer-field/integer-field.component";
import {NumberFieldComponent} from "../number-field/number-field.component";
import {TextFieldComponent} from "../text-field/text-field.component";
import {SelectFieldComponent} from "../select-field/select-field.component";
import {FieldComponent} from "../field/field.component";
import {HiddenFieldComponent} from "../hidden-field/hidden-field.component";
import {LocationSelectorComponent} from "../location-selector/location-selector.component";
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
  dataset?: Dataset;

  @Input()
  record: ClientRecord | null = null;

  @Input()
  writeable: boolean = false;

  @Input()
  countField?: string;

  @Input()
  dateField?: string;

  @Output()
  onDirty = new EventEmitter<boolean>();

  @Output()
  onValid = new EventEmitter<boolean>();

  form: FormGroup;
  fields?: FormDescriptor;

  subscriptions: Subscription[] = [];
  disabled: any = {};
  clientId: string = "";

  readonly: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private datasetService: DatasetService,
    private formGeneratorService: FormGeneratorService,
    private recordsService: RecordsService,
    private authenticationService: AuthenticationService,
  ) {
    this.form = this.formBuilder.group({});
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['dataset']) {
      this.setDataset();
    }
    if (changes['record']) {
      this.setRecord();
    }
  }

  async setDataset() {
    if (this.subscriptions.length) {
      this.subscriptions.forEach(sub => sub.unsubscribe());
    }
    const user = this.authenticationService.getUser();
    const data = this.record?.data || {};
    const writeable = !this.record || this.record.isWriteable();
    this.form = this.formGeneratorService.getFormGroup(this.formBuilder, data, this.dataset, writeable, user);
    this.subscriptions = [
      this.form.valueChanges.subscribe((values) => this.setValues(values)),
      this.form.statusChanges.subscribe((values) => this.statusChanges(values)),
    ];
  }

  setRecord() {
    if (!this.dataset || !this.record) return;
    const user = this.authenticationService.getUser();
    this.fields = this.formGeneratorService.getFormFields(this.dataset, this.form, this.record, user);
    this.disabled = this.formGeneratorService.getFormDisabledValues(this.dataset, this.form);

    // Ensure any disabled values are also updated for the record.
    this.setValues(this.form.getRawValue());
  }

  setValues(values: any) {
    const dataset = this.dataset;
    const record = this.record;
    if (!record || !dataset) return;

    record.dataset = dataset.id;
    record.datasetName = dataset.name || "";
    record.count = 0;
    record.data = {...this.disabled, ...values};

    this.formGeneratorService.postProcessFormValues(dataset, this.form, record.data);

    record.valid = this.form.valid;
    record.modified = this.form.dirty;

    // Default behaviour of count callback is how many child records exist.
    if (this.countField && values.hasOwnProperty(this.countField)) {
      record.count = values[this.countField] ? parseInt(values[this.countField], 10) : 0;
    } else {
      const records = this.recordsService.getChildRecords(record.client_id);
      record.count = records.length;
      record.valid = record.valid && !records.some(record => !record.valid);
    }

    if (this.dateField && values.hasOwnProperty(this.dateField)) {
      record.datetime = dayjs(values[this.dateField]).format();
    }

    // Stop triggering issues with templates that use valid/dirty.
    setTimeout(() => {
      this.onValid.emit(this.form.valid);
      this.onDirty.emit(this.form.dirty);
    }, 0);
  }

  statusChanges(value: string) {
  }

}
