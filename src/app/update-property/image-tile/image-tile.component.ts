import { Component, EventEmitter, Input, Output } from "@angular/core";
import { Image } from "../../models/image";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-image-tile",
  imports: [CommonModule],
  templateUrl: "./image-tile.component.html",
})
export class ImageTileComponent {
  @Input() imageInfo!: Image;
  @Input() mainImageRoute!: string;
  @Output() deleteImage = new EventEmitter<string>();
  @Output() setMainPicture = new EventEmitter<string>();

  onImageDelete() {
    this.deleteImage.emit(this.imageInfo.id);
  }
  onSetMainPicture() {
    this.setMainPicture.emit(this.imageInfo.path);
  }
}
