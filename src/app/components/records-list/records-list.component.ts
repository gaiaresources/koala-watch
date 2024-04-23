import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonicModule } from "@ionic/angular";
import { AsyncPipe, DatePipe, JsonPipe, NgForOf, NgIf } from "@angular/common";
import { ClientRecord } from "../../models/client-record";
import { StorageService } from "../../services/storage/storage.service";
import { from, map, Observable, switchMap } from "rxjs";
import { tap } from "rxjs/operators";
import { DATASET_NAME_CENSUS, DATASET_NAME_OBSERVATION, DATASET_NAME_TREESURVEY } from "../../tokens/app";
import { NavigationService } from "../../services/navigation/navigation.service";
import { ActiveRecordService } from "../../services/active-record/active-record.service";

@Component({
  selector: 'app-records-list',
  templateUrl: './records-list.component.html',
  styleUrls: ['./records-list.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    NgIf,
    NgForOf,
    DatePipe,
    AsyncPipe,
    JsonPipe
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

  @Output()
  onRecordClicked = new EventEmitter<ClientRecord>();

  protected clientRecords$: any[] = [];

  constructor(
    private storageService: StorageService,
    private navigationService: NavigationService,
    private activeRecordService: ActiveRecordService,
  ) {
  }

  ngOnInit() {
    this.storageService.getAllRecords().then((clientRecord) => {
      if (Array.isArray(clientRecord)) {
        clientRecord.forEach(record => this._records.push({
          data: record,
          statusColor: this.getStatusColor(record),
          altText: this.getAltText(record)
        }));
      }
    });
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
    this.activeRecordService.clear();
    if (record.client_id) {
      this.activeRecordService.setClientId(record.client_id);
      switch (record.datasetName) {
        case DATASET_NAME_OBSERVATION:
          this.navigationService.goObservation();
          break;
        case DATASET_NAME_CENSUS:
          this.navigationService.goCensus();
          break;
        case DATASET_NAME_TREESURVEY:
          this.navigationService.goSurvey();
          break;
        default:
          alert('Unable to determine record type');
      }
    }
  }

}
