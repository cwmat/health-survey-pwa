import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationState } from 'src/app/_shared/models/config.model';
import { MagicStrings } from 'src/app/_shared/models/magic-strings.model';
import { ObservationService } from 'src/app/_shared/services/observation.service';
import * as moment from 'moment';
import { UserMessages } from 'src/app/_shared/models/user-messages.model';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit {
  // Config
  header = MagicStrings.ConfirmationHeader;
  meetsAuxQs = false;
  messageActionRequired = UserMessages.ConfirmActionNeededShort;
  messageNoActionRequired = UserMessages.ConfirmNoActionNeededShort;
  appName = MagicStrings.AppName;

  constructor(
    public obsStore: ObservationService,
    private router: Router,
  ) { }

  public confirmationState: ConfirmationState = {};

  ngOnInit(): void {
    this.confirmationState = this.obsStore.getObservationSubmitState();
  }

  home() {
    this.obsStore.resetObservation();
    this.router.navigate(['/']);
  }

  homeNoReset() {
    this.router.navigate(['/']);
  }

  isWithinDateRange(): boolean {
    if (this.confirmationState?.dateOfObs) {
      const withinRange = moment(this.confirmationState.dateOfObs).isSameOrAfter(moment().subtract(2, 'months'));
      return withinRange;
    } else {
      return false;
    }
  }

}
