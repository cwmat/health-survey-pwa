import { Component, Inject, OnInit } from '@angular/core';
import {  MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { environment } from 'src/environments/environment';
import { ConfirmationSettings } from '../../models/user-messages.model';

@Component({
  selector: 'app-captcha-dialog',
  templateUrl: './captcha-dialog.component.html',
  styleUrls: ['./captcha-dialog.component.scss']
})
export class CaptchaDialogComponent implements OnInit {
  // Config
  siteKey = environment.captchaSiteKey;
  captchaValid = false;
  captchaV3Triggered = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ConfirmationSettings,
    private recaptchaV3Service: ReCaptchaV3Service,
  ) { }

  ngOnInit(): void {
    this.executeRecaptchaV3();
  }

  resolved(captchaResponse: string) {
    console.log(`Resolved captcha with response: ${captchaResponse}`);

    if (captchaResponse)
      this.captchaValid = true;
    else
      this.captchaValid = false;
  }

  executeRecaptchaV3() {
    this.recaptchaV3Service.execute('myAction').subscribe(
      token => {
        console.log('Pass', token);
        this.captchaValid = true;
        this.captchaV3Triggered = true;
      },
      error => {
        console.error('Fail', error);
        this.captchaValid = false;
        this.captchaV3Triggered = true;
      }
    );
  }

}
