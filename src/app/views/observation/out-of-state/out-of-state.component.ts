import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MagicStrings } from 'src/app/_shared/models/magic-strings.model';
import { ObservationService } from 'src/app/_shared/services/observation.service';

@Component({
  selector: 'app-out-of-state',
  templateUrl: './out-of-state.component.html',
  styleUrls: ['./out-of-state.component.scss']
})
export class OutOfStateComponent {
  // Config
  header = MagicStrings.OutOfStateHeader;

  constructor(
    private router: Router,
    public obsStore: ObservationService,
  ) { }

  home() {
    this.obsStore.resetObservation();
    this.router.navigate(['/']);
  }

  homeNoReset() {
    this.router.navigate(['/']);
  }
}
