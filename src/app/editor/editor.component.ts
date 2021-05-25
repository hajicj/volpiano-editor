import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {

  public volpiano: string = '1---';

  @ViewChild('textInput', {static: false}) textInput: ElementRef;

  constructor() { }

  ngOnInit(): void {
  }

  updateVolpiano() {
    this.volpiano = this.textInput.nativeElement.value;
  }

}
