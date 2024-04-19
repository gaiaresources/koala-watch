import { Component, OnInit } from '@angular/core';
import { ClientPhoto } from "../../models/client-photo";
import { IonButton, IonButtons } from "@ionic/angular/standalone";
import { AsyncPipe, NgIf } from "@angular/common";
import { PhotoComponent } from "../photo/photo.component";
import { combineLatest, map, Observable, tap } from "rxjs";
import { ActiveRecordService } from "../../services/active-record/active-record.service";

@Component({
  standalone: true,
  selector: 'app-photo-gallery',
  templateUrl: './photo-gallery.component.html',
  styleUrls: ['./photo-gallery.component.scss'],
  imports: [
    IonButton,
    NgIf,
    PhotoComponent,
    IonButtons,
    AsyncPipe,
  ]
})
export class PhotoGalleryComponent implements OnInit {

  previous: boolean = false;
  next: boolean = false;

  gallery$: Observable<{ photos: ClientPhoto[], current: number }>;

  constructor(
    private activeRecordService: ActiveRecordService,
  ) {
    this.gallery$ = combineLatest([
      this.activeRecordService.photos$,
      this.activeRecordService.currentPhoto$,
    ]).pipe(
      map(([photos, current]) => {
        return {photos, current};
      }),
      tap((data) => {
        this.setMoveButtons(data.current, data.photos.length);
      })
    );
  }

  ngOnInit() {
  }

  doChangePhoto(index: number) {
    this.activeRecordService.setCurrentPhoto(index);
  }

  setMoveButtons(current: number, length: number) {
    this.previous = current > 0;
    this.next = current < length - 1;
  }

}
