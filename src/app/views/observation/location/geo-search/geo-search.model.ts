import { IExtent, IPoint } from '@esri/arcgis-rest-types';

export interface Candidate {
    name: string;
    location: IPoint;
    extent: IExtent;
    source?: string
}

export interface Candidates {
    candidates: Candidate[];
    paddingLeft?: number;
    paddingBottom?: number;
}

export class SearchTypes {
    public static EsriGeocode: string = 'Esri Geocode';
    public static EsriSuggestion: string = 'Esri Suggestion';
    public static DDCoordinate: string = 'Coordinate';
}