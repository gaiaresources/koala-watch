import {Component, Input, OnInit} from '@angular/core';
import {BaseRecordPage} from "../base-record/base-record.page";
import {DATASET_NAME_OBSERVATION} from "../../tokens/app";
import {DatasetService} from "../../services/dataset/dataset.service";
import {BehaviorSubject, Observable, shareReplay} from "rxjs";
import {Dataset} from "../../models/dataset";
import {AsyncPipe, NgIf} from "@angular/common";
import {ClientRecord} from "../../models/client-record";
import {RecordsService} from "../../services/records/records.service";
import {ViewWillEnter} from "@ionic/angular";

@Component({
  selector: 'app-observation',
  templateUrl: './observation.page.html',
  styleUrls: ['./observation.page.scss'],
  standalone: true,
  imports: [
    BaseRecordPage,
    NgIf,
    AsyncPipe
  ]
})
export class ObservationPage implements OnInit, ViewWillEnter {

  dataset$: Observable<Dataset | null>;

  @Input()
  observation: string = "";

  _record = new BehaviorSubject<ClientRecord | null>(null);
  record$ = this._record.asObservable().pipe(
    shareReplay(1),
  );

  constructor(
    private datasetService: DatasetService,
    private recordsService: RecordsService,
  ) {
    this.dataset$ = this.datasetService.getDataset$(DATASET_NAME_OBSERVATION);
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.setRecord();
  }

  setRecord() {
    this.recordsService.getRecord$(this.observation).then((record) => {
      if (record) {
        this._record.next(record);
      } else {
        this._record.next(new ClientRecord());
      }
    });
  }


}
