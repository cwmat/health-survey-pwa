import { BreakpointObserver } from '@angular/cdk/layout';
import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatStepper, StepperOrientation } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { map} from 'rxjs/operators';
import { CaptchaDialogComponent } from 'src/app/_shared/components/captcha-dialog/captcha-dialog.component';
import { InfoDialogComponent } from 'src/app/_shared/components/info-dialog/info-dialog.component';
import { LoadingDialogComponent } from 'src/app/_shared/components/loading-dialog/loading-dialog.component';
import { ConfirmationState } from 'src/app/_shared/models/config.model';
import { ObservationDtoContainer } from 'src/app/_shared/models/observation.model';
import { UserMessages } from 'src/app/_shared/models/user-messages.model';
import { ApiService } from 'src/app/_shared/services/api.service';
import { AuthService } from 'src/app/_shared/services/auth.service';
import { ConnectionService } from 'src/app/_shared/services/connection.service';
import { LocalStorageService } from 'src/app/_shared/services/local-storage.service';
import { ObservationService } from 'src/app/_shared/services/observation.service';
import { environment } from 'src/environments/environment';
import { ContactComponent } from './contact/contact.component';
import { LocationComponent } from './location/location.component';

@Component({
  selector: 'app-observation',
  templateUrl: './observation.component.html',
  styleUrls: ['./observation.component.scss']
})
export class ObservationComponent implements AfterViewInit, OnDestroy {
  // Stepper config
  isLinear = true;
  stepperOrientation: Observable<StepperOrientation>;
  totalSteps = 3;

  // View children
  @ViewChild('stepper') stepper!: MatStepper;
  @ViewChild('location') location!: LocationComponent;
  @ViewChild('contact') contact!: ContactComponent;

  // Valid Check
  locationIsValid = false;
  contactIsValid = true;
  observationIsValid = false;
  isValid = false;
  hasVisitedContactTab = false;

  // Connection check
  isOffline!: boolean;

  // Subs
  isOffline$!: Subscription;

  constructor(
    breakpointObserver: BreakpointObserver,
    private router: Router,
    public obsStore: ObservationService,
    private dialog: MatDialog,
    private api: ApiService,
    private connectionService: ConnectionService,
    private localStorageService: LocalStorageService,
    private cd: ChangeDetectorRef,
    private authService: AuthService,
  ) {
    this.stepperOrientation = breakpointObserver.observe('(min-width: 800px)')
      .pipe(map(({matches}) => matches ? 'horizontal' : 'vertical'));

    this.isOffline = this.connectionService.isOffline;
    this.isOffline$ = this.connectionService.isOffline$().subscribe(res => {
      this.isOffline = res;
    });
  }

  ngAfterViewInit() {
    this.stepper.selectionChange.subscribe(res => {
      this.checkValid(res.selectedIndex);
    });
  }

  ngOnDestroy() {
    this.isOffline$.unsubscribe();
  }

  goBack(stepper: MatStepper) {
    stepper.previous();
  }

  goForward(stepper: MatStepper) {
    stepper.next();
  }

  routeOutOfState() {
    this.router.navigate(['/app/observation/outofstate']);
  }

  checkValid(newStepperIndex?: number) {
    let currentIdx: number;
    if (newStepperIndex === undefined) {
      currentIdx = this.stepper.selectedIndex;
    } else {
      currentIdx = newStepperIndex;
    }

    switch (currentIdx) {
      case 0:
        if (this.locationIsValid) {
          this.isValid = true;
        } else {
          this.isValid = false;
        }
        break;
      case 1:
        this.hasVisitedContactTab = true;
        if (this.contactIsValid) {
          this.isValid = true;
        } else {
          this.isValid = false;
        }
        break;
      case 2:

        break;

      default:
        break;
    }

    this.cd.detectChanges();
  }

  preCheck() {
    // Skip captcha if offline
    if (this.isOffline) {
      this.submit();
    } else {
      // Open captcha
      const dialogRef = this.dialog.open(CaptchaDialogComponent, {
        width: '35rem',
        data: { title: 'Submit Observation', text: UserMessages.ConfirmSubmit, confirm: 'Yes', cancel: 'No' },
        disableClose: true
      });

      dialogRef.afterClosed().subscribe(data => {
        if (data) {
          this.submit();
        }
      });
    }
  }

  async submit() {
    // Open loading spinner
    const saveRef = this.dialog.open(LoadingDialogComponent, {
      width: '25rem',
      data: "Saving Observation.",
      disableClose: true
    });

    // Get latest observation and media from store
    const obsContainer = this.obsStore.getObservationDto();
    const payload = obsContainer.data;
    const mediaPaylod = obsContainer.media;

    // Check if offline
    if (this.isOffline) {
      saveRef.close();

      this.offlineDialog(obsContainer);

      return;
    }

    // Refresh token
    await this.authService.login().toPromise();

    // POST to API
    this.api.createObservation(payload).subscribe(res => {
      const confNum = environment.useTestApi ? res.name : res as string;
      const confirmationObj = { confirmation: confNum, dateOfObs: payload.ObserverDate, success: true, requiresAction: this.obsStore.checkIfRequiresAction(payload) };

      // Will hold any media POST observables for the forkjoin below
      const mediaRequests = [] as Observable<any>[];
      if (mediaPaylod.length > 0) {
        mediaPaylod.forEach(e => {
          mediaRequests.push(this.api.createObservationMedia({...e, ConfirmationNumber: confNum}));
        });
        forkJoin(mediaRequests).subscribe(results => {
          // All uploads succeeded
          console.log(results);
          saveRef.close();
          this.routeToConfirmation(confirmationObj);
        }, error => {
          // One or all of the media items failed to upload
          console.error(error);
          saveRef.close();
        });
      } else {
        // There was no media uploads but the initial obs post worked
        saveRef.close();
        this.routeToConfirmation(confirmationObj);
      }
    }, err => {
      // The initial request failed or there was no confirmation number
      console.error(err);

      saveRef.close();

      this.offlineDialog(obsContainer);
    });

  }

  private routeToConfirmation(data: ConfirmationState) {
    this.obsStore.setObservationSubmitState({ ...data});
    this.router.navigate(['/app/observation/confirmation']);
  }

  private offlineDialog(obsContainer: ObservationDtoContainer) {
    const confirmDialogRef = this.dialog.open(InfoDialogComponent, {
      width: '35rem',
      data: { title: 'Currently Offline', text: UserMessages.CurrentlyOffline, confirm: 'Save and Return Home', cancel: 'Close' },
      disableClose: true
    });

    confirmDialogRef.afterClosed().subscribe(data => {
      if (data) {
        // Save offline
        this.localStorageService.setObservation(obsContainer);

        // Then reset and reroute home and reset
        this.obsStore.resetObservation();
        this.router.navigate(['/']);
      } else {
        // Stay on the page
      }
    });
  }

}
