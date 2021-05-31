import {Component, Input, OnInit} from '@angular/core';
import {Volpiano} from '../../data-structures/volpiano';

@Component({
  selector: 'app-syllable-view',
  templateUrl: './syllable-view.component.html',
  styleUrls: ['./syllable-view.component.css']
})
export class SyllableViewComponent implements OnInit {

  @Input() volpiano: Volpiano;
  @Input() text: string;

  @Input() isLastSyllable: boolean = false;
  @Input() isLastSyllableOfLastWord: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
