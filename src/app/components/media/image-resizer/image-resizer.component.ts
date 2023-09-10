import {Component, Input, OnInit} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {ImageCroppedEvent} from "ngx-image-cropper";

@Component({
  selector: 'app-image-resizer',
  templateUrl: './image-resizer.component.html',
  styleUrls: ['./image-resizer.component.scss']
})
export class ImageResizerComponent implements OnInit{
  @Input() imageBase64: string = "";
  public croppedImage: string | null | undefined = "";
  imageChangedEvent: any = '';

  constructor(public dialogRef: MatDialogRef<ImageResizerComponent>) { }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  imageLoaded() {
    // show cropper
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }

  ngOnInit() {
  }

  closeDialog() {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }

  saveCroppedImage() {
    if (this.dialogRef) {
      this.dialogRef.close(this.croppedImage);
    }
  }
}
