import { environment } from './../../../../environments/environment';
import { Component } from '@angular/core';

@Component({
  selector: 'app-version',
  templateUrl: './version.component.html',
  styleUrls: ['./version.component.scss']
})
export class VersionComponent {

  private _version: string;

  public get version() {
    return this._version;
  }

  private set version(version: string) {
    this._version = version;
  }

  constructor() {
    this._version = environment.appVersion;
  }

}
