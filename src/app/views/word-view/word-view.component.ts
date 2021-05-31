import {Component, Input, OnInit, QueryList, ViewChildren} from '@angular/core';
import {Volpiano} from '../../data-structures/volpiano';
import {ChantData} from '../../data-structures/chant';
import {SyllableViewComponent} from '../syllable-view/syllable-view.component';

@Component({
  selector: 'app-word-view',
  templateUrl: './word-view.component.html',
  styleUrls: ['./word-view.component.css']
})
export class WordViewComponent implements OnInit {

  @Input() chantWord: Array<[Volpiano, string]>;
  @Input() isLastWord: boolean;

  @ViewChildren(SyllableViewComponent) syllableViews: QueryList<SyllableViewComponent>;

  get volpiano(): Volpiano {
    const vSyls = this.chantWord.map(chantSyl => chantSyl[0].volpianoString);
    const vWord = vSyls.join(Volpiano.VOLPIANO_SYLLABLE_SEPARATOR);
    return new Volpiano(vWord);
  }
  get textSyllabized(): string {
    const tSyls = this.chantWord.map(chantSyl => chantSyl[1]);
    const tWord = tSyls.join(ChantData.TEXT_SYLLABLE_SEPARATOR);
    return tWord;
  }
  get textNotSyllabized(): string {
    const tSyls = this.chantWord.map(chantSyl => chantSyl[1]);
    const tWord = tSyls.join();
    return tWord;
  }
  get text(): string {
    return this.textSyllabized
  }

  constructor() { }

  ngOnInit(): void {
  }


}
