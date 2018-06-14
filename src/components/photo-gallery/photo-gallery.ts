import { Component, Input } from '@angular/core';
import { Camera, CameraOptions } from "@ionic-native/camera";
import { StorageService } from "../../shared/services/storage.service";
import { DomSanitizer } from "@angular/platform-browser";
import { UUID } from "angular2-uuid";
import * as moment from 'moment/moment';

@Component({
    selector: 'photo-gallery',
    templateUrl: 'photo-gallery.html'
})
export class PhotoGalleryComponent {

    constructor(private camera: Camera, private domSanitizer: DomSanitizer, private storageService: StorageService) {
    }

    public takePhoto() {
    }
}
