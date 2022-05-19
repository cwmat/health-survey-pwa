import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { BehaviorSubject, Observable } from 'rxjs';
import { ConfirmationState } from '../models/config.model';
import { MagicStrings } from '../models/magic-strings.model';
import { Observation, ObservationDto, ObservationDtoContainer, ObservationMediaDto } from '../models/observation.model';

@Injectable({
  providedIn: 'root'
})
export class ObservationService {

  private _initialState: Observation = {
    geometry: {},
    inState: true
  };
  private _observation: BehaviorSubject<Observation> = new BehaviorSubject(this._initialState);
  private _observationMedia: BehaviorSubject<ObservationMediaDto[]> = new BehaviorSubject([] as ObservationMediaDto[]);
  private _observationSubmitState: BehaviorSubject<ConfirmationState> = new BehaviorSubject({} as ConfirmationState);

  constructor() { }

  getObservation(): Observable<Observation> {
    return this._observation.asObservable();
  }

  getObservationMedia(): Observable<ObservationMediaDto[]> {
    return this._observationMedia.asObservable();
  }

  updateObservation(newObs: Observation) {
    this._observation.next({ ...newObs });
    return this.getObservation();
  }

  updateObservationMedia(newMedia: ObservationMediaDto[]) {
    this._observationMedia.next([ ...newMedia ]);
    return this.getObservationMedia();
  }

  resetObservation() {
    this._observation.next({ ...this._initialState });
    this._observationMedia.next([]);
    this._observationSubmitState.next({} as ConfirmationState);
    return this.getObservation();
  }

  getObservationDto(): ObservationDtoContainer {
    return {
      data: this.convertObsVmToDto(this._observation.value),
      media: this._observationMedia.value
    } as ObservationDtoContainer;
  }

  getObservationSubmitState() {
    return this._observationSubmitState.value;
  }

  setObservationSubmitState(data: ConfirmationState) {
    this._observationSubmitState.next({ ...data});
  }

  convertObsVmToDto(data: Observation): ObservationDto {
    return {
      LocationX: data.geometry?.long,
      LocationY: data.geometry?.lat,
      ObserverName: data.contact?.name,
      ObserverAffiliation: data.contact?.affiliation,
      ObserverEmail: data.contact?.email,
      ObserverPhone: data.contact?.phone,
      ObserverDate: new Date(),
      ObservationDate: data.information?.date,
      AnimalCountId: data.information?.numberOfAnimals,
      SpeciesId: data.information?.species,
      WildlifeStatusId: data.information?.alive,
      SickInjured: data.information?.sickOrInjured,
      Possession: data.information?.inYourPossession,
      Poachingsuspect: data.information?.poaching,
      WildlifeAgeId: data.information?.age,
      OriginId: data.information?.captiveWild,
      Rabies: data.information?.rabies,
      ZoonoticExposure: data.information?.zoonotic,
      ObservationDescrition: data.information?.details
    } as ObservationDto;
  }

  checkIfRequiresAction(data: ObservationDto): boolean {
    const mainLogic = (
      data.Rabies === MagicStrings.RefLookupYes ||
      data.Poachingsuspect === MagicStrings.RefLookupYes ||
      data.ZoonoticExposure === MagicStrings.RefLookupYes || 
      data.SpeciesId === MagicStrings.RefSpeciesBear ||
      data.SpeciesId === MagicStrings.RefSpeciesBobcat ||
      data.SpeciesId === MagicStrings.RefSpeciesDeer ||
      data.SpeciesId === MagicStrings.RefSpeciesElk ||
      data.SpeciesId === MagicStrings.RefSpeciesTurkey ||
      data.OriginId === MagicStrings.RefCaptive ||
      data.OriginId === MagicStrings.RefOriginUnknown ||
      data.OriginId === MagicStrings.RefOriginBoth
    );
    if (
      mainLogic ||
      (data.AnimalCountId === MagicStrings.RefGreater10 && (data.WildlifeStatusId === MagicStrings.RefLookupDead || data.WildlifeStatusId === MagicStrings.BothMultipleAnimals)) ||
      ((data.WildlifeStatusId === MagicStrings.RefLookupAlive || data.WildlifeStatusId === MagicStrings.BothMultipleAnimals) && data.Possession === MagicStrings.RefLookupYes) ||
      ((data.WildlifeStatusId === MagicStrings.RefLookupAlive || data.WildlifeStatusId === MagicStrings.BothMultipleAnimals || data.WildlifeStatusId === MagicStrings.RefStatusUnknown) && data.SickInjured === MagicStrings.RefLookupYes)
      ) {
      return true;
    } else {
      return false;
    }
  }

  isWithinDateRange(data: Date | undefined): boolean {
    if (data) {
      const withinRange = moment(data).isSameOrAfter(moment().subtract(2, 'months'));
      return withinRange;
    } else {
      return false;
    }
  }

  getConfirmationAction(data: ObservationDto) {
    if (
      this.checkIfRequiresAction(data) &&
      this.isWithinDateRange(data.ObservationDate)
    ) {
      // Action needed
      return MagicStrings.ConfFreshActionNeeded;

    } else if (
      !this.checkIfRequiresAction(data) &&
      this.isWithinDateRange(data.ObservationDate)
    ) {
      // No action needed
      return MagicStrings.ConfFreshNoAction;

    } else if (
      !this.isWithinDateRange(data.ObservationDate)
    ) {
      // Stale
      return MagicStrings.ConfStale;

    } else {
      console.error('Issue mapping data to confirmation type');

      return 'error';
    }
  }


}
