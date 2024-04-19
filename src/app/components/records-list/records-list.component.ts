import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonicModule } from "@ionic/angular";
import { DatePipe, NgForOf, NgIf } from "@angular/common";
import { ClientRecord } from "../../models/client-record";

@Component({
  selector: 'app-records-list',
  templateUrl: './records-list.component.html',
  styleUrls: ['./records-list.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    NgIf,
    NgForOf,
    DatePipe
  ]
})
export class RecordsListComponent implements OnInit {

  RECORD_COMPLETE = '#ebffef';
  RECORD_INCOMPLETE = '#ebf6ff';
  RECORD_UPLOADED = '#ebf0df';

  @Input()
  showLegend: boolean = true;

  @Input()
  datasetPrefix: string = "";

  @Input()
  datasetIcon: string = "";

  @Input()
  countIcon: string = "";

  _records: { data: ClientRecord, statusColor: string, altText: string }[] = [];
  @Input()
  set records(value: ClientRecord[]) {
    this._records = value.map(record => {
      return {
        data: record,
        statusColor: this.getStatusColor(record),
        altText: this.getAltText(record),
      };
    });
  }

  @Output()
  onRecordClicked = new EventEmitter<ClientRecord>();

  constructor() {
  }

  ngOnInit() {
  }


  public getStatusColor(record: ClientRecord) {
    if (record.id) {
      return this.RECORD_UPLOADED;
    }
    return record.valid ? this.RECORD_COMPLETE : this.RECORD_INCOMPLETE;
  }

  public getAltText(record: ClientRecord): string {
    let rv = this.datasetPrefix + ' ';
    if (record.id) {
      rv += 'uploaded';
    } else {
      rv += record.valid ? 'complete but not uploaded' : 'incomplete';
    }
    return rv;
  }

  /*
  public getDatasetIcon(record: ClientRecord): string {
    switch (record.datasetName) {
      case DATASET_NAME_OBSERVATION:
        return 'assets/imgs/eye.png';
      case DATASET_NAME_CENSUS:
        return 'assets/imgs/trees.png';
      case DATASET_NAME_TREESURVEY:
        return 'assets/imgs/tree.png';
      default:
        return 'assets/imgs/koala.png';
    }
  }

  public getCountIcon(record: ClientRecord): string {
    switch (record.datasetName) {
      case DATASET_NAME_OBSERVATION:
        return 'assets/imgs/koala.png';
      case DATASET_NAME_CENSUS:
        return 'assets/imgs/tree.png';
      case DATASET_NAME_TREESURVEY:
        return 'assets/imgs/koala.png';
      default:
        return 'assets/imgs/koala.png';
    }
  }
   */

  doRecordClicked(record: ClientRecord) {
    this.onRecordClicked.emit(record);
  }

}
