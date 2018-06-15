import { Component, Input } from '@angular/core';
import { Camera, CameraOptions } from "@ionic-native/camera";
import { StorageService } from "../../shared/services/storage.service";
import { UUID } from "angular2-uuid";
import { DomSanitizer } from "@angular/platform-browser";
import * as moment from 'moment/moment';
import { from } from "rxjs/observable/from";
import { mergeMap } from "rxjs/operators";

@Component({
    selector: 'photo-gallery',
    templateUrl: 'photo-gallery.html'
})
export class PhotoGalleryComponent {

    public src: string;

    private _recordId: string = "";
    private _photoIds: string[] = [];
    private photoIndex: number = 0;
    private addedPhotoIds: string[] = [];
    private deletedPhotoIds: string[] = [];

    public showPhotos() {
        return this._photoIds.length > 0;
    }

    public pageLeftClick() {
        if(this.photoIndex > 0) {
            this.photoIndex -= 1;
            this.updateImage();
        }
    }

    public pageRightClick() {
        if(this.photoIndex < this._photoIds.length - 1) {
            this.photoIndex += 1;
            this.updateImage();
        }
    }

    public set PhotoIds(thePhotoIds: string[]) {
        if(thePhotoIds) {
            this._photoIds = thePhotoIds;
        } else {
            this._photoIds = [];
        }

        this.photoIndex = 0;
        this.updateImage();
    }

    public get PhotoIds(): string[] {
        return this._photoIds;
    }

    public set RecordId(theRecordId: string) {
        this._recordId = theRecordId;
    }

    constructor(private camera: Camera, private domSanitizer: DomSanitizer, private storageService: StorageService) {
    }

    public deleteClick() {
        if(this._photoIds.length <= 0) {
            return;
        }

        if(confirm("Delete photo? ")) {
            const photoId = this._photoIds[this.photoIndex];
            this.removeStringFromArray(this._photoIds, photoId);
            if(this.removeStringFromArray(this.addedPhotoIds, photoId)) {
                this.deletePhotoUsingId(photoId);
            } else {
                this.deletedPhotoIds.push(photoId);
            }
            if(this.photoIndex >= this._photoIds.length) {
                this.photoIndex -= 1;
            }
            this.updateImage();
        }
    }

    private removeStringFromArray(array: string[], item: string): boolean {
        const index = array.indexOf(item);
        if (index > -1) {
            array.splice(index, 1);
        }
        return index > -1;
    }

    private updateImage() {
        if(this._photoIds[this.photoIndex].length == 0) {
            this.src = "";
            return;
        }

        this.storageService.getPhoto(this._photoIds[this.photoIndex]).subscribe(clientPhoto => {
            if(clientPhoto) {
                this.src = PhotoGalleryComponent.makeImageSrc(clientPhoto.base64);
            } else {
                this.src = "";
            }
        });
    }

    public takePhoto() {
        if(this._photoIds.length >= 3) {
            alert('Maximum number of photos reached');
            return;
        }

        const options: CameraOptions = {
            quality: 100,
            targetWidth: 1024,
            targetHeight: 1024,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE
        };

        this.camera.getPicture(options).then((base64) => {
            let photoId = UUID.UUID();
            this.storageService.putPhoto(photoId, {
                id: photoId,
                fileName: photoId + ".jpg",
                parentId: this._recordId,
                base64: base64,
                datetime: moment().format()
            }).subscribe(put =>{
                if(put) {
                    this._photoIds.push(photoId);
                    this.addedPhotoIds.push(photoId);
                    let imageSrc = PhotoGalleryComponent.makeImageSrc(base64);
                    this.photoIndex = this._photoIds.length - 1;
                    this.src = imageSrc;
                } else {
                    alert('Photo save failed, try again');
                }
            })
        }, err => {
            alert('Photo failed, try again');
        });
    }

    public commit() {
        from(this.deletedPhotoIds).pipe(
            mergeMap( photoId => this.storageService.deletePhoto(photoId) )
        ).subscribe();
    }

    public rollback() {
        from(this.addedPhotoIds).pipe(
            mergeMap( photoId => this.storageService.deletePhoto(photoId) )
        ).subscribe();
    }

    private deletePhotoUsingId(photoId: string) {
        this.storageService.deletePhoto(photoId).subscribe(deleted => {
        });
    }

    private static makeImageSrc(base64: string): string {
        return 'data:image/jpeg;base64,' + base64;
    }

}
