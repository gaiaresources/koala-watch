import {Component, Input, OnInit} from '@angular/core';
import {AsyncPipe, NgIf} from '@angular/common';
import {BaseRecordPage} from "../base-record/base-record.page";
import {BehaviorSubject, Observable, shareReplay} from "rxjs";
import {Dataset} from "../../models/dataset";
import {ClientRecord} from "../../models/client-record";
import {DatasetService} from "../../services/dataset/dataset.service";
import {DATASET_NAME_TREESURVEY} from "../../tokens/app";
import {RecordsService} from "../../services/records/records.service";
import {Router} from "@angular/router";
import {ViewWillEnter} from "@ionic/angular";

@Component({
  selector: 'app-survey',
  templateUrl: './survey.page.html',
  styleUrls: ['./survey.page.scss'],
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    BaseRecordPage
  ]
})
export class SurveyPage implements OnInit, ViewWillEnter {

  @Input()
  census: string = "";

  @Input()
  survey: string = "";

  dataset$: Observable<Dataset | null>;

  _record = new BehaviorSubject<ClientRecord | null>(null);
  record$ = this._record.asObservable().pipe(
    shareReplay(1),
  );

  constructor(
    private datasetService: DatasetService,
    private recordsService: RecordsService,
    private router: Router,
  ) {
    this.dataset$ = this.datasetService.getDataset$(DATASET_NAME_TREESURVEY);
  }

  ngOnInit() {
  }

  ionViewWillEnter(): void {
    this.setRecord();
  }

  doSegment() {}

  async setRecord() {
    const parent = await this.recordsService.getRecord$(this.census);
    if (!parent) return;
    const parentData = parent.data || {};

    const existing = await this.recordsService.getRecord$(this.survey);
    if (!existing) {
      this._record.next(new ClientRecord({
        parentId: parent.client_id,
        data: {
          'Census ID': parentData['Census ID'],
          'SiteNo': parentData['SiteNo'],
        },
      }));
    } else {
      this._record.next(existing);
    }
  }

}
