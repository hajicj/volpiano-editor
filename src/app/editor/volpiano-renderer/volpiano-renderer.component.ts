import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-volpiano-renderer',
  templateUrl: './volpiano-renderer.component.html',
  styleUrls: ['./volpiano-renderer.component.css']
})
export class VolpianoRendererComponent implements OnInit {

  @Input() volpiano: string;

  constructor() { }

  ngOnInit(): void {
  }

}
