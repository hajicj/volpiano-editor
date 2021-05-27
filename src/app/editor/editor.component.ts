import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {find} from 'rxjs/operators';

import { Volpiano } from '../volpiano';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {

  public volpiano: Volpiano = new Volpiano('1---');
  public fulltext: string = '';

  @ViewChild('volpianoInput', {static: false}) volpianoInput: ElementRef;
  @ViewChild('fulltextInput', {static: false}) fulltextInput: ElementRef;

  constructor() { }

  ngOnInit(): void {
  }

  updateVolpiano() {
    this.volpiano.volpianoString = this.volpianoInput.nativeElement.value;
  }

  updateFulltext() {
    this.fulltext = this.fulltextInput.nativeElement.value;
  }

  get isSyllabized(): boolean {
    return this.fulltext.includes('-');
  }

  get textWords(): Array<string> {
    if (this.fulltext === "") { return []; }
    const words = this.fulltext.split(' ');
    return words;
  }

  get textSyllables(): Array<string> {
    let syllables: Array<string> = [];
    for (const word of this.textWords) {
      syllables.push(...word.split('-'));
    }
    return syllables;
  }
  get textSyllablesCount(): number {
    return this.textSyllables.length;
  }

  get volpianoWords(): Array<string> {
    const words = this.volpiano.musicWords();
    // console.log('Volpiano words returned:');
    // console.log(words);
    return words;
  }

  get volpianoSyllables(): Array<string> {
    const syllables = this.volpiano.musicSyllables();
    return syllables;
  }

  get volpianoSyllablesCount(): number {
    return this.volpianoSyllables.length;
  }


}
