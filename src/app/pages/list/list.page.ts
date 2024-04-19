import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { RecordsListComponent } from "../../components/records-list/records-list.component";

@Component({
  selector: 'app-list',
  templateUrl: './list.page.html',
  styleUrls: ['./list.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, RecordsListComponent]
})
export class ListPage implements OnInit, OnChanges {

  @Input()
  dataset: string = "";

  constructor() {
  }

  ngOnInit() {
  }

  ngOnChanges() {

  }

}
