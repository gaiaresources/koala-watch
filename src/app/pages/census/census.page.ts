import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {AsyncPipe, NgIf} from '@angular/common';
import {IonButton, IonContent, IonFooter, IonLabel, IonSegmentButton} from '@ionic/angular/standalone';
import {BaseRecordPage} from '../base-record/base-record.page';
import {BehaviorSubject, distinctUntilChanged, map, Observable, shareReplay} from 'rxjs';
import {Dataset} from '../../models/dataset';
import {DatasetService} from '../../services/dataset/dataset.service';
import {DATASET_NAME_CENSUS} from '../../tokens/app';
import {RecordListComponent} from '../../components/record-list/record-list.component';
import {ClientRecord} from '../../models/client-record';
import {RecordsService} from '../../services/records/records.service';
import {NavigationService} from '../../services/navigation/navigation.service';
import {ViewWillEnter} from '@ionic/angular';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-census',
  templateUrl: './census.page.html',
  styleUrls: ['./census.page.scss'],
  standalone: true,
  imports: [
    RecordListComponent,
    NgIf,
    AsyncPipe,
    BaseRecordPage,
    IonSegmentButton,
    IonButton,
    IonContent,
    IonFooter,
    IonLabel
  ]
})
export class CensusPage implements OnInit, ViewWillEnter {

  @ViewChild(BaseRecordPage)
  private recordPage?: BaseRecordPage;

  @Input()
  census: string = '';

  dataset$: Observable<Dataset | null>;

  _record = new BehaviorSubject<ClientRecord | null>(null);
  record$ = this._record.asObservable().pipe(
    distinctUntilChanged(),
    shareReplay(1),
  );

  children$: Observable<ClientRecord[]> = this.record$.pipe(
    map((record) => {
      if (!record) {
        return [];
      }
      return this.recordsService.getChildRecords(record.client_id);
    }),
    shareReplay(1),
  );

  segment: string = 'form';
  valid: boolean = false;
  dirty: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private datasetService: DatasetService,
    private recordsService: RecordsService,
    private navigationService: NavigationService,
  ) {
    this.dataset$ = this.datasetService.getDataset$(DATASET_NAME_CENSUS);
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const segmentId = params['segmentId'];
      if (segmentId) {
        this.segment = segmentId;
      } else {
        this.segment = 'form';
      }
    });
  }

  ionViewWillEnter() {
    this.setRecord();
  }

  setRecord() {
    this.recordsService.getRecord$(this.census).then((record) => {
      if (record) {
        this._record.next(record);
        this.valid = record.valid;
      } else {
        this._record.next(new ClientRecord());
      }
    });
  }

  doValid(valid: boolean) {
    this.valid = valid;
  }

  doDirty(dirty: boolean) {
    this.dirty = dirty;
  }

  doSegment(segment: string) {
    this.segment = segment;
  }

  async doNewSurvey() {
    const record = this._record.value;

    if (!record || !this.recordPage) {
      return;
    }

    const recordModified = this.recordPage.dirty
    const recordShouldBeSaved = recordModified || this.census == "create"

    let shouldSave = false
    if(recordShouldBeSaved) {
      shouldSave = await this.recordPage.shouldSave();
    }

    let didSave = false
    if (shouldSave) {
      didSave = await this.recordPage.doSave();
    }

    if(!recordShouldBeSaved || didSave) {
      this.navigationService.goSurvey(record);
    }
  }

}
