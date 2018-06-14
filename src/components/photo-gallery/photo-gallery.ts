import { Component, Input, OnInit } from '@angular/core';
import { Camera, CameraOptions } from "@ionic-native/camera";
import { StorageService } from "../../shared/services/storage.service";
import { UUID } from "angular2-uuid";
import { DomSanitizer } from "@angular/platform-browser";
import * as moment from 'moment/moment';

class ImageRecord {
    public id: string;
    public src: string;
}

@Component({
    selector: 'photo-gallery',
    templateUrl: 'photo-gallery.html'
})
export class PhotoGalleryComponent implements OnInit {

    private addedPhotoIds: string[] = [];
    private deletedPhotoIds: string[] = [];

    public slides: ImageRecord[] = [];
    public src: string;
    public slideIndex: number = 0;

    public photoIds: string[];

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

    public getAddedPhotoIds() : string[] {
        return this.addedPhotoIds;
    }

    public getDeletedPhotoIds(): string[] {
        return this.deletedPhotoIds;
    }

    constructor(private camera: Camera, private domSanitizer: DomSanitizer, private storageService: StorageService) {
    }

    ngOnInit() {
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
        this.deleteNextDeletedPhoto(0);
    }

    public rollback() {
        this.deleteNextAddedPhoto(0);
    }

    private deleteNextAddedPhoto(photoIndex: number) {
        if(photoIndex < this.addedPhotoIds.length) {
            this.storageService.deletePhoto(this.addedPhotoIds[photoIndex]).subscribe( deleted => {
                this.deleteNextAddedPhoto(photoIndex + 1);
            })
        }
    }

    private deleteNextDeletedPhoto(photoIndex: number) {
        if(photoIndex < this.deletedPhotoIds.length) {
            this.storageService.deletePhoto(this.deletedPhotoIds[photoIndex]).subscribe( deleted => {
                this.deleteNextDeletedPhoto(photoIndex + 1);
            })
        }
    }

    private deletePhotoUsingId(photoId: string) {
        this.storageService.deletePhoto(photoId).subscribe(deleted => {
        });
    }

    private loadPhotos() {
        if(this.photoIds != undefined && this.photoIds != null) {
            this.loadNextPhoto(0);
        }
    }

    private loadNextPhoto(photoIndex: number) {
        if(this.photoIds.length > photoIndex) {
            this.storageService.getPhoto(this.photoIds[photoIndex]).subscribe(
                photoRecord => {
                    if(photoRecord != undefined && photoRecord != null) {
                        let imageSrc = PhotoGalleryComponent.makeImageSrc(photoRecord.base64);

                        this.slides.push({
                            id: this.photoIds[photoIndex],
                            src: imageSrc
                        });
                        this.loadNextPhoto(photoIndex + 1);
                    } else {
                        alert('Load photo failed ' + photoIndex + ' ' +  this.photoIds[photoIndex]);
                    }
                }
            );
        } else {
            if(photoIndex > 0) {
                this.slideIndex = 0;
                this.src = this.slides[0].src;
            } else {
                this.slideIndex = null;
                this.src = null;
            }
        }
    }

    private static makeImageSrc(base64: string): string {
        return 'data:image/jpeg;base64,' + base64;
    }

}
