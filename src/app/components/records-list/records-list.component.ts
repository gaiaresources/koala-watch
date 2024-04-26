import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonicModule } from "@ionic/angular";
import { DatePipe, NgForOf, NgIf } from "@angular/common";
import { ClientRecord } from "../../models/client-record";
import { StorageService } from "../../services/storage/storage.service";
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
    DatePipe
  ]
})
export class RecordsListComponent implements OnInit {

  @Input()
  showLegend: boolean = true;

  @Input()
  datasetPrefix: string = "";

  _records: { data: ClientRecord, statusClass: string, altText: string, datasetIcon: string, countIcon: string }[] = [];

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
          statusClass: this.getStatusClass(record),
          altText: this.getAltText(record),
          datasetIcon: this.getDatasetIcon(record),
          countIcon: this.getCountIcon(record),
        }));
      }
    });
  }

  public getStatusClass(record: ClientRecord) {
    if (record.id) {
      return 'uploaded';
    }
    return record.valid ? 'completed' : 'incomplete';
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
