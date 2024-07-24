import {Component, Input, OnInit} from '@angular/core';
import {IonButton, IonImg, IonLabel} from "@ionic/angular/standalone";
import {faCamera} from "@fortawesome/free-solid-svg-icons";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {NgIf} from "@angular/common";
import {IconProp} from "@fortawesome/fontawesome-svg-core";

@Component({
  standalone: true,
  selector: 'app-fab-button',
  templateUrl: './fab-button.component.html',
  styleUrls: ['./fab-button.component.scss'],
  imports: [
    IonButton,
    IonImg,
    IonLabel,
    FaIconComponent,
    NgIf
  ]
})
export class FabButtonComponent implements OnInit {

  @Input()
  src?: string;

  @Input()
  text: string = "";

  @Input()
  icon?: IconProp;

  constructor() {
  }

  ngOnInit() {
  }

  protected readonly faCamera = faCamera;
}
