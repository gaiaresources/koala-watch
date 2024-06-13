import { Component, Input, OnInit } from '@angular/core';
import { AsyncPipe, NgIf } from "@angular/common";
import { ActiveRecordService } from "../../services/active-record/active-record.service";
import { Observable } from "rxjs";
import { ClientPhoto } from "../../models/client-photo";
import { IonButton, IonCard, IonCardContent } from "@ionic/angular/standalone";
import { CameraService } from "../../services/camera/camera.service";
import { PhotoGalleryComponent } from "../photo-gallery/photo-gallery.component";
import { tap } from "rxjs/operators";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faCamera, faImage } from "@fortawesome/free-solid-svg-icons";
import {ActivePhotoService} from "../../services/active-photo/active-photo.service";


@Component({
  selector: 'app-record-photos',
  templateUrl: './record-photos.component.html',
  styleUrls: ['./record-photos.component.scss'],
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    IonButton,
    IonCard,
    IonCardContent,
    PhotoGalleryComponent,
    FontAwesomeModule
  ]
})
export class RecordPhotosComponent implements OnInit {

  public faCamera = faCamera
  public faImage = faImage

  @Input()
  readonly: boolean = false;

  photos$: Observable<ClientPhoto[]>;

  constructor(
    private activePhotoService: ActivePhotoService,
    private cameraService: CameraService,
  ) {
    this.photos$ = this.activePhotoService.photos$;
  }

  ngOnInit() {
  }

  async doCameraPhoto() {
    await this.cameraService.getCameraPhoto();
  }

  async doLibraryPhoto() {
    await this.cameraService.getLibraryPhoto();
  }

}
