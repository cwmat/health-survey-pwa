import { Component } from '@angular/core';
import { MagicStrings } from '../../models/magic-strings.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  appName = MagicStrings.AppName;
}
