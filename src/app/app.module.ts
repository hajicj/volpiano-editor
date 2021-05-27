import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { EditorComponent } from './editor/editor.component';
import { FormsModule } from '@angular/forms';
import { VolpianoRendererComponent } from './editor/volpiano-renderer/volpiano-renderer.component';
import { ImageViewComponent } from './image-view/image-view.component';
import { ZoomableCanvasComponent } from './image-view/zoomable-canvas/zoomable-canvas.component';


@NgModule({
  declarations: [
    AppComponent,
    EditorComponent,
    VolpianoRendererComponent,
    ImageViewComponent,
    ZoomableCanvasComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
