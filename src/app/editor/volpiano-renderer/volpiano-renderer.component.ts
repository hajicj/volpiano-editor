import {Component, Input, OnInit} from '@angular/core';
import {Volpiano} from '../../data-structures/volpiano';
import {ChantData} from '../../data-structures/chant';

@Component({
  selector: 'app-volpiano-renderer',
  templateUrl: './volpiano-renderer.component.html',
  styleUrls: ['./volpiano-renderer.component.css']
})
export class VolpianoRendererComponent implements OnInit {

  @Input() volpiano: Volpiano;
  @Input() text: string;

  constructor() { }

  ngOnInit(): void {
  }

  get alignedWords(): Array<[Volpiano, string]> {
    return ChantData.alignVolpianoAndTextWords(this.volpiano, this.text);
  }

  get alignedWordsAndSyllables(): Array<Array<[Volpiano, string]>> {
    return ChantData.alignVolpianoAndTextWordsAndSyllables(
      this.volpiano, this.text, false);
  }

}
