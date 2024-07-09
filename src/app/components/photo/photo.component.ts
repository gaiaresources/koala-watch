import {Component, Input, OnInit} from '@angular/core';
import {ClientPhoto} from "../../models/client-photo";
import {NgIf} from "@angular/common";
import {ActivePhotoService} from "../../services/active-photo/active-photo.service";
import {IonImg} from "@ionic/angular/standalone";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faTrash, faTrashAlt, faTrashCan} from "@fortawesome/free-solid-svg-icons";

@Component({
  standalone: true,
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.scss'],
  imports: [
    NgIf,
    IonImg,
    FaIconComponent,
  ]
})
export class PhotoComponent implements OnInit {

  @Input()
  photo?: ClientPhoto;

  @Input()
  index?: number;

  constructor(
    private activePhotoService: ActivePhotoService,
  ) {
  }

  ngOnInit() {
  }

  doDelete() {
    if (this.photo !== undefined) {
      this.activePhotoService.deletePhoto(this.photo);
    }
  }

  protected readonly faTrashCan = faTrashCan;
  protected readonly faTrash = faTrash;
  protected readonly faTrashAlt = faTrashAlt;
}
