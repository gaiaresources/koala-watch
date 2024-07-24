import {Component, Input, OnInit} from '@angular/core';
import {IonFab} from "@ionic/angular/standalone";

@Component({
  standalone: true,
  selector: 'app-fab-slot',
  templateUrl: './fab-slot.component.html',
  styleUrls: ['./fab-slot.component.scss'],
  imports: [
    IonFab
  ]
})
export class FabSlotComponent implements OnInit {

  @Input()
  horizontal: string = "";

  @Input()
  vertical: string = "";

  constructor() {
  }

  ngOnInit() {
  }

}
