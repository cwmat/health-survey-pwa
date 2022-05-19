import { Species } from "./config.model";

export interface PointGeom {
    lat?: number;
    long?: number;
}

export interface Contact {
    name?: string;
    affiliation?: string;
    email?: string;
    phone?: number;
}

export interface Information {
    date?: Date;
    numberOfAnimals?: string;
    species?: number | Species;
    alive?: number;
    sickOrInjured?: number;
    inYourPossession?: number;
    poaching?: number;
    age?: number;
    captiveWild?: number;
    rabies?: number;
    zoonotic?: number;
    details?: string;
}

export interface Observation {
    geometry?: PointGeom;
    inState?: boolean;
    contact?: Contact;
    information?: Information;
}

export interface ObservationDto {
  LocationX?: number
  LocationY?: number
  ObserverName?: string;
  ObserverAffiliation?: number;
  ObserverEmail?: string;
  ObserverPhone?: string;
  ObserverDate?: Date;
  ObservationDate?: Date;
  AnimalCountId?: number;
  SpeciesId?: number;
  WildlifeStatusId?: number;
  SickInjured?: number;
  Possession?: number;
  Poachingsuspect?: number;
  WildlifeAgeId?: number;
  OriginId?: number;
  Rabies?: number;
  ZoonoticExposure?: number;
  ObservationDescrition?: string;
}

export interface ObservationMediaDto {
  FileName?: string;
  File?: string;
  ConfirmationNumber?: string;
}

export interface ObservationDtoContainer {
  data: ObservationDto;
  media: ObservationMediaDto[];
  uid?: string;
  dbId?: number;
}

export interface ObservationConfirmatonVm {
  SpeciesId?: number;
  SpeciesName?: string;
  Date?: Date;
  ConfirmationNumber?: string;
  ConfirmationAction?: string;
}
