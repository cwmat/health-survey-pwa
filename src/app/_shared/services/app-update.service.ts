import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

@Injectable({
  providedIn: 'root'
})
export class AppUpdateService {
constructor(
  private readonly updates: SwUpdate,
  ) {
  console.log('Checking for app update');
  this.updates.available.subscribe(event => {
    this.doAppUpdate();
  });
}

doAppUpdate() {
    console.log('Attempt app update');
    this.updates.activateUpdate().then(() => {
      console.log('App updated');
      document.location.reload()
    });
  }
}