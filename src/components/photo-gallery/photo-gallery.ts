import { Component, Input } from '@angular/core';
import {Camera, CameraResultType, CameraSource, ImageOptions} from '@capacitor/camera';
import { StorageService } from '../../shared/services/storage.service';
import { UUID } from 'angular2-uuid';
import { DomSanitizer } from '@angular/platform-browser';
import { from, mergeMap } from 'rxjs';
import { AlertController } from '@ionic/angular';
import moment from "moment";

@Component({
    selector: 'photo-gallery',
    templateUrl: 'photo-gallery.html'
})
export class PhotoGalleryComponent {


    @Input()
    public readonly: boolean;

    // Template variables

    public photoSrc = '';

    // Property variables

    private _recordId = '';
    private _photoIds: string[] = [];

    // Private variables

    private photoIndex = 0;
    private addedPhotoIds: string[] = [];
    private deletedPhotoIds: string[] = [];

    // Property getters and setters

    public set PhotoIds(thePhotoIds: string[]) {
        if (thePhotoIds) {
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

    // Private static methods

    private static makePhotoSrc(base64: string): string {
        return 'data:image/jpeg;base64,' + base64;
    }

    // Constructor

    constructor(private storageService: StorageService, private alertController: AlertController, public domSanitizer: DomSanitizer) {}

    // Template methods

    public showPhotos() {
        if (!this._photoIds) {
            return  false;
        } else {
            return this._photoIds.length > 0;
        }
    }

    public showLeftChevron(): boolean {
        return this.photoIndex > 0;
    }

    public showRightChevron(): boolean {
        return this._photoIds && this.photoIndex < this._photoIds.length - 1;
    }

    public pageLeftClick() {
        if (this.photoIndex > 0) {
            this.photoIndex -= 1;
            this.updateImage();
        }
    }

    public pageRightClick() {
        if (this.photoIndex < this._photoIds.length - 1) {
            this.photoIndex += 1;
            this.updateImage();
        }
    }

    public deleteClick() {
        if (this._photoIds.length <= 0) {
            return;
        }

        this.alertController.create({
            header: 'Photos',
            message: 'Delete photo?',
            backdropDismiss: true,
            buttons: [
                {
                    text: 'Yes',
                    handler: () => {
                        const photoId = this._photoIds[this.photoIndex];
                        this.removeStringFromArray(this._photoIds, photoId);
                        if (this.removeStringFromArray(this.addedPhotoIds, photoId)) {
                            this.deletePhotoUsingId(photoId);
                        } else {
                            this.deletedPhotoIds.push(photoId);
                        }
                        if (this.photoIndex >= this._photoIds.length) {
                            this.photoIndex -= 1;
                        }
                        this.updateImage();
                    }
                },
                {
                    text: 'No'
                }]
        }).then((alert) => { alert.present() })
    }

    public onClickedNewPhoto(useCamera: boolean) {
        if (this._photoIds.length >= 10) {
            alert('Maximum number of photos reached');
            return;
        }

        const options: ImageOptions = {
            source: useCamera ? CameraSource.Camera : CameraSource.Photos,
            quality: 100,
            width: 1024,
            height: 1024,
            resultType: CameraResultType.DataUrl,
            correctOrientation: true
        };

        Camera.getPhoto(options).then((photo) => {
          console.log('CXamerta', this._recordId);
            const photoId = UUID.UUID();
            this.storageService.putPhoto({
                clientId: photoId,
                fileName: photoId + '.jpg',
                recordClientId: this._recordId,
                base64: photo.base64String!,
                datetime: moment.defaultFormat
            }).subscribe(put => {
                if (put) {
                    this._photoIds.push(photoId);
                    this.addedPhotoIds.push(photoId);
                    const photoSrc = PhotoGalleryComponent.makePhotoSrc(photo.base64String!);
                    this.photoIndex = this._photoIds.length - 1;
                    this.photoSrc = photoSrc;
                } else {
                    alert('Photo save failed, try again');
                }
            });
        }, err => {
            alert('Photo failed, try again');
        });
    }

    // Public methods

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

    // Private methods

    private removeStringFromArray(array: string[], item: string): boolean {
        const index = array.indexOf(item);
        if (index > -1) {
            array.splice(index, 1);
        }
        return index > -1;
    }

    private updateImage() {
        if (!this._photoIds) {
            this.photoSrc = '';
            this.photoIndex = 0;
            return;
        }

        this.storageService.getPhoto(this._photoIds[this.photoIndex]).subscribe(clientPhoto => {
            if (clientPhoto) {
                this.photoSrc = PhotoGalleryComponent.makePhotoSrc(clientPhoto.base64);
            } else {
                this.photoSrc = '';
            }
        });
    }

    private deletePhotoUsingId(photoId: string) {
        this.storageService.deletePhoto(photoId).subscribe(deleted => {
        });
    }

    protected readonly DomSanitizer = DomSanitizer;
}
