import {Component, Input, OnInit} from '@angular/core';
import {IonImg} from "@ionic/angular/standalone";

@Component({
  standalone: true,
  selector: 'app-image-icon',
  templateUrl: './image-icon.component.html',
  styleUrls: ['./image-icon.component.scss'],
  imports: [
    IonImg,
  ]
})
export class ImageIconComponent implements OnInit {

  @Input()
  src: string = "";

  @Input()
  ariaLabel: string = "";


  constructor() {
  }

  ngOnInit() {
  }

}
