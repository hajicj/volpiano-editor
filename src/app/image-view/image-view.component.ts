import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import panzoom from "panzoom";

@Component({
  selector: 'app-image-view',
  templateUrl: './image-view.component.html',
  styleUrls: ['./image-view.component.css']
})
export class ImageViewComponent implements OnInit, AfterViewInit {

  public imageURL: string = '';

  @ViewChild('imageContainer', {static: false}) imageContainer: ElementRef;
  @ViewChild('imageURLInput', {static: false}) imageURLInput: ElementRef;
  @ViewChild('image', {static: false}) image: ElementRef;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    panzoom(this.imageContainer.nativeElement,
      {filterKey: function() { return true; },
      minZoom: 0.2,
      maxZoom: 10,
      smoothScroll: false,
      bounds: true });
  }

  loadImageFromURL() {
    this.imageURL = this.imageURLInput.nativeElement.value;
  }

}
