import {Component, OnInit} from '@angular/core';
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {
  IonContent,
  IonLabel,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from '@ionic/angular/standalone';
import {RecordsService} from "../../services/records/records.service";
import {Observable} from "rxjs";
import {ClientRecord} from "../../models/client-record";
import {HeaderToolbarComponent} from '../../components/header-toolbar/header-toolbar.component';

@Component({
  selector: 'app-records',
  templateUrl: './records.page.html',
  styleUrls: ['./records.page.scss'],
  standalone: true,
  imports: [
    FaIconComponent,
    IonContent,
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonLabel,
    HeaderToolbarComponent
  ]
})
export class RecordsPage implements OnInit {

  public records$: Observable<ClientRecord[]>;

  constructor(
    private recordsService: RecordsService
  ) {
    this.records$ = this.recordsService.getDisplayRecords$();
  }

  ngOnInit() {
  }

}
