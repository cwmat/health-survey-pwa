import { Component } from '@angular/core';
import { MagicStrings } from '../_shared/models/magic-strings.model';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {
  appName = MagicStrings.AppName;
}
