import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin, Subscription } from 'rxjs';
import { ApiService } from 'src/app/_shared/services/api.service';
import { AuthService } from 'src/app/_shared/services/auth.service';
import { environment } from 'src/environments/environment';
import * as config from 'src/assets/overrides.json';
import { ConnectionService } from 'src/app/_shared/services/connection.service';
import { MagicStrings } from 'src/app/_shared/models/magic-strings.model';
import { LocationStrategy } from '@angular/common';
import { HttpClient } from '@angular/common/http';

const CONFIG_DATA = config;

@Component({
  selector: 'app-splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.scss']
})
export class SplashComponent implements OnInit {
  // Connection check
  isOffline!: boolean;

  // Subs
  isOffline$!: Subscription;

  // Images
  bgImg = MagicStrings.BgImages;

  constructor(
    private router: Router,
    private api: ApiService,
    private auth: AuthService,
    private connectionService: ConnectionService,
    private locationStrategy: LocationStrategy,
    private http: HttpClient,
  ) {
    this.isOffline = this.connectionService.isOffline;
    this.isOffline$ = this.connectionService.isOffline$().subscribe(res => {
      this.isOffline = res;
    });
  }

  ngOnInit(): void {
    this.handleLoad();
    
  }

  async handleLoad() {
    // Sometimes navigator.onLine has trouble on first load so test a GET with this canary
    const canary = await this.api.canaryTest();

    // Bypass login if using a dev/test API
    if (environment.useTestApi) {
      this.cacheAndReroute();
    } else {
      // If offline, skip login and pull endpoints from service worker cache
      if (this.isOffline || canary === false) {
        console.log('Offline, skipping login');
        this.cacheAndReroute();
      } else {
        // Try login, still might fail if the above canary was holding on to cache so
        // try one last attempt to cache without login just in case
        console.log('Online, login');
        this.auth.login().subscribe(authRes => {
          this.cacheAndReroute();
          this.cachImages();
        }, err => {
          console.error('May be offline attempting cache', err);
          this.cacheAndReroute();
        });
      }
    }
  }

  private cacheAndReroute() {
    // Cache API lookups
    this.cacheEndpoints().subscribe(res => {
      console.log('Cached endpoints');
    });

    // Load any necessary app data and then nav to home
    this.router.navigate(['/app/home']);
  }

  private cachImages() {
    this.bgImg.forEach(element => {
      const currentBgImg = `${window.location.origin}${this.locationStrategy.getBaseHref()}assets/images/${element}.png`;
      this.http.get(currentBgImg).subscribe();
    });
  }

  private cacheEndpoints() {
    return forkJoin([
      // Animal Count
      this.api.getAnimalCount(),
      // Species
      this.api.getSpecies(),
      // Yes/No
      this.api.getYesNo(),
      // Age
      this.api.getAge(),
      // Captive
      this.api.getCaptive(),
      // Classification
      this.api.getClassification(),
      // Affiliation
      this.api.getAffiliation(),
      // Wildlife
      this.api.getWildlifeStatus()
    ]);
  }

}
