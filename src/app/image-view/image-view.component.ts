import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import panzoom from "panzoom";

@Component({
  selector: 'app-image-view',
  templateUrl: './image-view.component.html',
  styleUrls: ['./image-view.component.css']
})
export class ImageViewComponent implements OnInit, AfterViewInit {

  public imageURL: string = '';

  // @ViewChild('imageContainer', {static: false}) imageContainer: ElementRef;
  @ViewChild('imageURLInput', {static: false}) imageURLInput: ElementRef;
  // @ViewChild('image', {static: false}) image: ElementRef;

  public top: number;
  public bottom: number;
  public left: number;
  public right: number;
  public centerX: number;
  public centerY: number;
  public zoomLevel: number = 0.0;
  public maxZoom: number = 1.0;
  public minZoom: number = -2.0;
  public canvasWidth: number;
  public canvasHeight: number;

  private _imageElement: HTMLImageElement = new Image();
  get imageElement(): HTMLImageElement { return this._imageElement; }

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    // panzoom(this.imageContainer.nativeElement,
    //   {filterKey: function() { return true; },
    //   minZoom: 0.2,
    //   maxZoom: 10,
    //   smoothScroll: false,
    //   bounds: true });
    this.imageElement.addEventListener("load", function() {
      const imgWidth = this.naturalWidth;
      const imgHeight = this.naturalHeight;
      // this.right = this.left + imgWidth;
      // this.bottom = this.top + imgWidth;
    })
  }

  loadImageFromURL() {
    this.imageURL = this.imageURLInput.nativeElement.value;
    this.imageElement.src = this.imageURL;
  }

  setCanvasWidth(event: number) { this.canvasWidth = event as unknown as number; }
  setCanvasHeight(event: number) { this.canvasHeight = event as unknown as number; }

}
