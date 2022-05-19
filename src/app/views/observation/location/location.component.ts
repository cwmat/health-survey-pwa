import { Component, EventEmitter, Output } from '@angular/core';
import { take } from 'rxjs/operators';
import { MagicStrings } from 'src/app/_shared/models/magic-strings.model';
import { Observation, PointGeom } from 'src/app/_shared/models/observation.model';
import { UserMessages } from 'src/app/_shared/models/user-messages.model';
import { ObservationService } from 'src/app/_shared/services/observation.service';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.scss']
})
export class LocationComponent {
  // Config
  header = MagicStrings.LocationHeader;
  content = UserMessages.LocationHelperText;
  mapIsActive = false;

  // Outputs
  @Output() isValid = new EventEmitter<boolean>(false);

  constructor(
    public obsStore: ObservationService,
  ) { }

  updateLocation(event: PointGeom) {
    this.obsStore.getObservation()
      .pipe(take(1))
      .subscribe(res => {
        const newData = { ...res };
        newData.geometry = event;
        this.obsStore.updateObservation(newData);
        this.checkValid(newData);
    });
  }

  updateIntersectStatus(event: boolean) {
    this.obsStore.getObservation()
      .pipe(take(1))
      .subscribe(res => {
        const newData = { ...res };
        newData.inState = event;
        this.obsStore.updateObservation(newData);
        this.checkValid(newData);
    });
  }

  newActiveMapEvent(isActive: boolean) {
    this.mapIsActive = isActive;
    if (this.mapIsActive)
      this.checkValid({});
  }

  checkValid(data: Observation) {
    if (data && data?.geometry && data?.geometry?.lat && data?.geometry?.long && !this.mapIsActive) {
      this.isValid.emit(true);
    } else {
      this.isValid.emit(false);
    }
  }
}
