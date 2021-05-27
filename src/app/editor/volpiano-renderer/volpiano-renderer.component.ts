import {Component, Input, OnInit} from '@angular/core';
import {Volpiano} from '../../volpiano';

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

}
