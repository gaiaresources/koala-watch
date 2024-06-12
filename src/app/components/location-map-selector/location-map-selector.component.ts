import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {IonButton, IonButtons, IonContent, IonHeader, IonModal, IonTitle, IonToolbar} from "@ionic/angular/standalone";
import {GoogleMapComponent} from "../google-map/google-map.component";
import {Coordinates} from "../../models/coordinates";

@Component({
  standalone: true,
  selector: 'app-location-map-selector',
  templateUrl: './location-map-selector.component.html',
  styleUrls: ['./location-map-selector.component.scss'],
  imports: [
    IonContent,
    IonModal,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonTitle,
    GoogleMapComponent
  ]
})
export class LocationMapSelectorComponent implements OnInit {

  @ViewChild(IonModal) modal?: IonModal;

  coords: Coordinates = {lat: 0, lng: 0, altitude: -1, accuracy: -1};

  @Output()
  onSelect = new EventEmitter<Coordinates>();

  constructor() {
  }

  ngOnInit() {
  }

  onWillDismiss(e: any) {
  }

  onCancel() {
    this.modal?.dismiss(null, 'cancel');
  }

  onConfirm() {
    this.modal?.dismiss(null, 'confirm');
    this.onSelect.emit(this.coords);
  }

  doPosition(coords: Coordinates) {
    this.coords = coords;
  }

}
