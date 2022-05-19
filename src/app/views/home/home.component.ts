import { UserMessages } from 'src/app/_shared/models/user-messages.model';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { InfoDialogComponent } from 'src/app/_shared/components/info-dialog/info-dialog.component';
import { MagicStrings } from 'src/app/_shared/models/magic-strings.model';
import { ObservationConfirmatonVm, ObservationDtoContainer } from 'src/app/_shared/models/observation.model';
import { LocalStorageService } from 'src/app/_shared/services/local-storage.service';
import { ApiService } from 'src/app/_shared/services/api.service';
import * as moment from 'moment';
import { LocationStrategy } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {
  // Config
  appName = MagicStrings.AppName;
  appAbbrev = MagicStrings.AppAbbrev;
  isSuperZoom = false;
  gameCommissionPhone = MagicStrings.GameCommissionPhone;

  // Offline observations
  offlineObs: ObservationDtoContainer[]  = [];
  offlineObsCount: number = 0;

  // Elements
  @ViewChild('mainContents') mainContents!: ElementRef;
  basePageHeight: number = 900;
  basePageOffsetSmall = 500;
  basePageOffsetExtraSmall = 500;
  basePageHeightStyle: string = 'height: 100vh;'

  // BG Images
  bgImg = MagicStrings.BgImages;
  currentBgImg: string;

  constructor(
    private router: Router,
    private localStorageService: LocalStorageService,
    private dialog: MatDialog,
    private api: ApiService,
    private cd: ChangeDetectorRef,
    private locationStrategy: LocationStrategy,
  ) {
    this.currentBgImg = `${window.location.origin}${this.locationStrategy.getBaseHref()}assets/images/${this.bgImg[Math.floor(Math.random() * this.bgImg.length)]}.png`;
  }

  ngOnInit() {
    this.loadOfflineObservations();
    this.onResize(null);
  }

  ngAfterViewInit() {
    this.setPageHeight();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    console.log('Resize', event);
    this.setPageHeight();
    const estimateZoom = (( window.outerWidth - 10 ) / window.innerWidth) * 100;
      if (estimateZoom >= 300)
        this.isSuperZoom = true;
      else
        this.isSuperZoom = false;
  }

  setPageHeight(): void {
    if (!this.mainContents)
      return;

    this.basePageHeightStyle = 'height: 100vh;';
    this.cd.detectChanges();

    const width = window.innerWidth;
    const contentHeight: number = this.mainContents?.nativeElement?.clientHeight || null;

    if (width < 1200 && width >= 376) {
      console.log('m detected');
      this.basePageHeight = contentHeight + this.basePageOffsetSmall;
      this.basePageHeightStyle = `height: ${this.basePageHeight}px`;
    } else if (width < 376) {
      console.log('xs detected');
      this.basePageHeight = contentHeight + this.basePageOffsetExtraSmall;
      this.basePageHeightStyle = `height: ${this.basePageHeight}px`;
    } else {
      // 1200 +
      console.log('l detected');
      this.basePageHeightStyle = 'height: 100vh;';
    }

    this.cd.detectChanges();
  }

  createObservation() {
    this.router.navigate(['/app/observation']);
  }

  async loadOfflineObservations() {
    this.offlineObs = await this.localStorageService.getObservations();
    this.offlineObsCount = this.offlineObs.length;
  }

  uploadProcessed(confNum: ObservationConfirmatonVm) {
    this.loadOfflineObservations();
  }

  async alluploadsProcessed(confNums: ObservationConfirmatonVm[]) {
    // Get species list for VM
    const speciesList = await this.api.getSpecies().toPromise();

    if (speciesList) {
      confNums = confNums.map(e => {
        const SpeciesName = speciesList.find(x => e.SpeciesId === x.SpeciesId)?.Name;
        return { ...e, SpeciesName };
      });
    }

    //  Break into core lists based on the necessary action
    const actionList = confNums.filter(e => e.ConfirmationAction === MagicStrings.ConfFreshActionNeeded);
    const noActionList = confNums.filter(e => e.ConfirmationAction === MagicStrings.ConfFreshNoAction);
    const staleList = confNums.filter(e => e.ConfirmationAction === MagicStrings.ConfStale);

    // Create HTML for each section
    const actionHtml = this.createUploadSection(actionList);
    const noActionHtml = this.createUploadSection(noActionList);
    const staleHtml = this.createUploadSection(staleList);

    // Create final message
    let message = `
      <div class="appConfirmTop">${UserMessages.BulkUploadConfirmation}</div>
    `;

    if (noActionList.length > 0 || staleList.length > 0) {
      message = message + `
      <h1 class="appUploadHeader">${MagicStrings.ConfirmationHeaderNoActionNeeded}</h1>
      <div class="appUploadMessage">${UserMessages.ConfirmNoActionNeededShort}</div>
      <div class="appUploadMessage">Your confirmation numbers are:</div>
      <div>${noActionHtml}</div>
      <div>${staleHtml}</div>
      <div>Remember to always remain at a safe distance when observing wildlife and do not handle wildlife unless you are hunting, trapping, or authorized to do so. More information can be found at <a href="https://CLIENT.pa.gov/wildlifehealth" target="_blank">CLIENT.pa.gov/wildlifehealth</a>.</div>
      <hr/>
      `;
    }

    if (actionList.length > 0) {
      message = message + `
      <h1 class="appUploadHeader">${MagicStrings.ConfirmationHeaderActionNeeded}</h1>
      <div class="appUploadMessage">${UserMessages.ConfirmActionNeededShort}</div>
      <div class="appUploadMessage">Your confirmation numbers are:</div>
      <div>${actionHtml}</div>
      <div>Remember to always remain at a safe distance when observing wildlife and do not handle wildlife unless you are hunting, trapping, or authorized to do so. More information can be found at <a href="https://CLIENT.pa.gov/wildlifehealth" target="_blank">CLIENT.pa.gov/wildlifehealth</a>.</div>
      <hr/>
      `;
    }

    this.dialog.open(InfoDialogComponent, {
      width: '45rem',
      data: { title: MagicStrings.ConfirmationHeader, text: message, confirm: 'Close', extraSpace: true },
      disableClose: false
    });
  }

  private createUploadSection(dataList: ObservationConfirmatonVm[]): string {
    let bullets = '';
    dataList.forEach(e => {
      bullets = bullets + this.createUploadRow(e);
    });

    return bullets;
  }

  private createUploadRow(data: ObservationConfirmatonVm): string {
    return `<p><strong>${data.ConfirmationNumber} - ${data.SpeciesName} - ${moment(data.Date).format('DD/MM/YYYY')}</strong></p>`;
  }

}
