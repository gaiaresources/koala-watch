import {Component, Input, OnInit} from '@angular/core';
import {faCircleQuestion} from "@fortawesome/free-regular-svg-icons";
import {IonButton, IonContent, IonPopover} from "@ionic/angular/standalone";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";

@Component({
  standalone: true,
  selector: 'app-help-button',
  templateUrl: './help-button.component.html',
  styleUrls: ['./help-button.component.scss'],
  imports: [
    IonButton,
    FaIconComponent,
    IonPopover,
    IonContent,
  ]
})
export class HelpButtonComponent implements OnInit {
  protected readonly faCircleQuestion = faCircleQuestion;

  @Input({ required: true })
  id: string = "";

  constructor() {
  }

  ngOnInit() {
  }
}
