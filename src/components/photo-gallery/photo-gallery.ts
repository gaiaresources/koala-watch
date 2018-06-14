import { Component, Input } from '@angular/core';
import { Camera, CameraOptions } from "@ionic-native/camera";
import { StorageService } from "../../shared/services/storage.service";
import { UUID } from "angular2-uuid";
import { DomSanitizer } from "@angular/platform-browser";
import * as moment from 'moment/moment';
import {from} from "rxjs/observable/from";
import {mergeMap} from "rxjs/operators";

class ImageRecord {
    public id: string;
    public src: string;
}

@Component({
    selector: 'photo-gallery',
    templateUrl: 'photo-gallery.html'
})
export class PhotoGalleryComponent {

    public slides: ImageRecord[] = [];
    public src: string;
    public slideIndex: number = 0;
    public photoIds: string[];

    private addedPhotoIds: string[] = [];
    private deletedPhotoIds: string[] = [];

    public showPhotos() {
        return this.slides.length > 0;
    }

    public pageLeft() {
        if(this.slideIndex > 0) {
            this.slideIndex -= 1;
            this.src = this.slides[this.slideIndex].src;
        }
    }

    public pageRight() {
        if(this.slideIndex < this.slides.length - 1) {
            this.slideIndex += 1;
            this.src = this.slides[this.slideIndex].src;
        }
    }

    public setPhotoIds(photoIds: string[]) {
        this.photoIds = photoIds;

        if(this.photoIds == undefined || this.photoIds == null) {
            this.photoIds = [];
        }

        this.loadPhotos();
    }

    public recordId: string;

    constructor(private camera: Camera, private domSanitizer: DomSanitizer, private storageService: StorageService) {
    }

    public delete(imageRecord: ImageRecord) {
        if(this.slides.length <= 0) {
            return;
        }

        if(confirm("Delete photo? ")) {
            const imageRecord = this.slides[this.slideIndex];
            if (this.slideIndex > -1) {
                this.slides.splice(this.slideIndex, 1);
            }
            const photoIdIndex = this.photoIds.indexOf(imageRecord.id);
            if (photoIdIndex > -1) {
                this.photoIds.splice(photoIdIndex, 1);
            }
            const addedPhotoIdIndex = this.addedPhotoIds.indexOf(imageRecord.id);
            if (addedPhotoIdIndex > -1) {
                this.deletePhotoUsingId(imageRecord.id);
                this.addedPhotoIds.splice(photoIdIndex, 1);
            } else {
                this.addPhotoIdToDeletedList(imageRecord.id);
            }

            if(this.slideIndex >= this.slides.length) {
                this.slideIndex -= 1;
                if(this.slideIndex >= 0) {
                    this.src = this.slides[this.slideIndex].src;
                } else {
                    this.src = null;
                    this.slideIndex = null;
                }
            } else {
                this.src = this.slides[this.slideIndex].src;
            }
        }
    }

    public takePhoto() {
        if(this.slides.length >= 3) {
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
            console.log('added ' + photoId);
            this.storageService.putPhoto(photoId, {
                id: photoId,
                fileName: photoId + ".jpg",
                parentId: this.recordId,
                base64: base64,
                datetime: moment().format()
            }).subscribe(put =>{
                if(put) {
                    this.addPhotoIdToPhotosList(photoId);
                    this.addedPhotoIds.push(photoId);
                    let imageSrc = PhotoGalleryComponent.makeImageSrc(base64);
                    this.slides.push({
                        id: photoId,
                        src: imageSrc
                    });
                    this.slideIndex = this.slides.length - 1;
                    this.src = this.slides[this.slideIndex].src;
                } else {
                    alert('Photo save failed, try again');
                }
            })
        }, err => {
            alert('Photo failed, try again');
        });
    }

    public addPhotoIdToPhotosList(photoId: string) {
        if(this.photoIds == undefined || this.photoIds == null) {
            this.photoIds = [photoId];
        } else {
            this.photoIds.push(photoId);
        }
    }

    public addPhotoIdToDeletedList(photoId: string) {
        if(this.deletedPhotoIds == undefined || this.deletedPhotoIds == null) {
            this.deletedPhotoIds = [photoId];
        } else {
            this.deletedPhotoIds.push(photoId);
        }
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

    private loadPhotos() {
            let photoIndex = 0;

            from(this.photoIds).pipe(
                mergeMap( photoId => this.storageService.getPhoto(photoId) )
            ).subscribe(photoRecord => {
                if(photoRecord != undefined && photoRecord != null) {
                    let imageSrc = PhotoGalleryComponent.makeImageSrc(photoRecord.base64);
                    if(!this.src) {
                        this.src = imageSrc;
                    }
                    this.slides.push({
                        id: this.photoIds[photoIndex],
                        src: imageSrc
                    });
                }
            });
    }

    private static makeImageSrc(base64: string): string {
        return 'data:image/jpeg;base64,' + base64;
    }

}
