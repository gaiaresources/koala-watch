import {Component, Input, OnChanges, SimpleChanges} from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {ClientRecord} from "../../models/client-record";
import {StorageService} from "../../services/storage/storage.service";
import {DATASET_NAME_CENSUS, DATASET_NAME_OBSERVATION, DATASET_NAME_TREESURVEY} from "../../tokens/app";
import {NavigationService} from "../../services/navigation/navigation.service";

@Component({
  selector: 'app-record-list',
  templateUrl: './record-list.component.html',
  styleUrls: ['./record-list.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    NgIf,
    NgForOf,
    DatePipe
  ]
})
export class RecordListComponent implements OnChanges {

  @Input()
  showLegend: boolean = true;

  @Input()
  records: ClientRecord[] = [];

  displayRecords: {
    data: ClientRecord,
    statusClass: string,
    altText: string,
    datasetIcon: string,
    countIcon: string
  }[] = [];

  constructor(
    private storageService: StorageService,
    private navigationService: NavigationService,
  ) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['records']) {
      this.displayRecords = this.records.map(
        (record) => {
          return {
            data: record,
            statusClass: this.getStatusClass(record),
            altText: this.getAltText(record),
            datasetIcon: this.getDatasetIcon(record),
            countIcon: this.getCountIcon(record),
          };
        }
      );
    }
  }

  public getStatusClass(record: ClientRecord) {
    if (record.id) {
      return 'uploaded';
    }
    return record.valid ? 'completed' : 'incomplete';
  }

  public getAltText(record: ClientRecord): string {
    let rv = ' ';
    switch (record.datasetName) {
      case DATASET_NAME_OBSERVATION:
        rv = 'Observation ';
        break;
      case DATASET_NAME_CENSUS:
        rv = 'Census ';
        break;
      case DATASET_NAME_TREESURVEY:
        rv = 'Tree Survey ';
        break;
    }
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
    if (record.client_id) {
      switch (record.datasetName) {
        case DATASET_NAME_OBSERVATION:
          this.navigationService.goObservation(record);
          break;
        case DATASET_NAME_CENSUS:
          this.navigationService.goCensus(record);
          break;
        case DATASET_NAME_TREESURVEY:
          this.navigationService.goSurvey(new ClientRecord({client_id: record.parentId}), record);
          break;
        default:
          alert('Unable to determine record type');
      }
    }
  }

}
