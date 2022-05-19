import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-intro-helper-text',
  templateUrl: './intro-helper-text.component.html',
  styleUrls: ['./intro-helper-text.component.scss']
})
export class IntroHelperTextComponent {
  // Inputs
  @Input() header: string = '';
  @Input() content: string = '';
  @Input() centerHeader: boolean = false;
  @Input() insertHtmlContent: boolean = false;
}
