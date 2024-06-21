import {Component, Input, OnInit} from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {ClientPhoto} from "../../models/client-photo";
import {NgIf} from "@angular/common";
import {ActivePhotoService} from "../../services/active-photo/active-photo.service";

@Component({
  standalone: true,
  selector: 'app-photo',
  templateUrl: './photo.component.html',
  styleUrls: ['./photo.component.scss'],
  imports: [
    IonicModule,
    NgIf
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

}
