import { Component, Input, OnInit } from '@angular/core';
import { IonicModule } from "@ionic/angular";
import { ClientPhoto } from "../../models/client-photo";
import { NgIf } from "@angular/common";
import { ActiveRecordService } from "../../services/active-record/active-record.service";

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
    private activeRecordService: ActiveRecordService
  ) {
  }

  ngOnInit() {
  }

  doDelete() {
    if (this.index !== undefined) {
      this.activeRecordService.deletePhoto(this.index);
    }
  }

}
