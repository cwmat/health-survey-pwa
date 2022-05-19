export interface AnimalCount {
    AnimalCountId?: number;
    Name?: string;
    SortKey?: number;
}

export interface Affiliation {
    RefTableDataId?: number;
    Name?: string;
    SortKey?: number;
}

export interface Species {
    SpeciesId?: number;
    Name?: string;
    ClassificationId: number;
    SortKey?: number;
    ContentType?: string;
    Description?: string;
    Extension?: string;
    PhotoCredit?: string;
    Photo?: string;
}

export interface YesNo {
    RefTableDataId?: number;
    Name?: string;
    SortKey?: number;
}

export interface Age {
    WildlifeAgeId?: number;
    Name?: string;
    SortKey?: number;
}

export interface Captive {
    OrigintId?: number;
    Name?: string;
    SortKey?: number;
}

export interface Classification {
    ClassificationId?: number;
    Name?: string;
    SortKey?: number;
}

export interface WildlifeStatus {
    WildlifeStatusId?: number;
    Name?: string;
    SortKey?: number;
}

export interface ObsResponse {
    confirmation?: string;
    name?: string;
    confirmationnumber?: string;
}

export interface ObsMediaResponse {
    confirmation?: string;
}

export interface ConfirmationState {
    confirmation?: string;
    dateOfObs?: Date;
    success?: boolean;
    requiresAction?: boolean;
}