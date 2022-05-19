import { Injectable } from '@angular/core';
import { geocode, IEndpointOptions, IGeocodeOptions, suggest } from '@esri/arcgis-rest-geocoding';
import { ApiKey } from '@esri/arcgis-rest-auth';
import { IExtent, IPoint } from '@esri/arcgis-rest-types';
import { BehaviorSubject, Observable, Subject, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Candidate, SearchTypes } from './geo-search.model';

@Injectable({
  providedIn: 'root'
})
export class GeoSearchService {

  private readonly defaultBias: number[] = [-77.1945, 41.2033]; // Rough Center of PA

  private readonly defaultMaxCandidates: number = 10;

  private readonly webMercatorExtentOffset: number = 32000;  // Will only be valid for a projected coordinate system using meters as base unit (ex: Web Mercator)

  // @ts-ignore
  private candidates$: BehaviorSubject<Candidate[]> = new BehaviorSubject([]);

  private subs: Subscription[] = [];

  authentication = new ApiKey({
    key: environment.esriApiKey
  });

  constructor() { }

  public getCandidates(): Observable<Candidate[]> {
    return this.candidates$.asObservable();
  }

  private setCandidates(inCandidates: Candidate[]) {
    this.candidates$.next(inCandidates);
  }

  private isCoordinate(inString: string) {
    const trimString = inString.trim();
    const isInCoordForm = /^(-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)$/.test(trimString);
    const containsLatLong = inString.includes('Lat: ') && inString.includes('Long: ');

    if (
      (trimString &&
      isInCoordForm &&
      trimString.length >= 5) ||
      containsLatLong) 
    {
      return true;
    } else {
      return false;
    }
  }

  private getCoordFromString(inCoordString: string): IPoint {
    const containsLatLong = inCoordString.includes('Lat: ') && inCoordString.includes('Long: ');
    let newCoord;
    if (containsLatLong) {
      const splitReplaceString = inCoordString
        .replace('Lat: ', '')
        .replace('Long: ', '')
        .trim().split(',');
      newCoord = {
        x: parseFloat(splitReplaceString[1]),
        y: parseFloat(splitReplaceString[0])
      } as IPoint;
    } else {
      // Assumes that the string has already been verified as a valid coord
      const splitString = inCoordString.trim().split(',');
      newCoord = {
        x: parseFloat(splitString[1]),
        y: parseFloat(splitString[0])
      } as IPoint;
    }

    return newCoord || null
  }

  searchCandidates(
    inString: string,
    biasCoord?: number[],
    maxCandidates?: number
  ) {

    if (this.subs.length) {
      this.subs.forEach(sub => {
        sub.unsubscribe();
      })

      this.subs = [];
    }
    if (!inString) {
      this.clearCandidates();
    }

    if (!biasCoord)
      biasCoord = this.defaultBias;

    if (!maxCandidates)
      maxCandidates = this.defaultMaxCandidates;

    if (Object.prototype.toString.call(inString) !== "[object String]")
      return;

    let resultsSubject: Subject<Candidate[]> = new Subject<Candidate[]>();

    let res: any[] = [];

    if (this.isCoordinate(inString)) {
      const coordPoint: IPoint = this.getCoordFromString(inString);
      const coordCandidate = {
        name: `Lat: ${coordPoint.y}, Long: ${coordPoint.x}`,
        location: { x: coordPoint.x, y: coordPoint.y },
        extent: {
          xmax: coordPoint.x + this.webMercatorExtentOffset,
          xmin: coordPoint.x - this.webMercatorExtentOffset,
          ymax: coordPoint.y + this.webMercatorExtentOffset,
          ymin: coordPoint.y - this.webMercatorExtentOffset
        } as IExtent,
        source: SearchTypes.DDCoordinate
      } as Candidate;

      this.setCandidates([coordCandidate]);
      return;
    }

    let resultSub = resultsSubject.subscribe(result => {
      res = res.concat(result);
      this.setCandidates(res);
    });

    this.subs = [resultSub];
    
    suggest(inString, {
        authentication: this.authentication,
        location: `${biasCoord[0]},${biasCoord[1]}`,
        countryCode: 'USA',
        maxSuggestions: 3
      } as IEndpointOptions)
      .then(suggestResult => {
      if (suggestResult.suggestions.length < 1) {
        this.clearCandidates();
        return;
      }

      suggestResult.suggestions.forEach(suggestion => {
        if(!suggestion.isCollection)
        {
           geocode({
            authentication: this.authentication,
            singleLine: suggestion.text,
            magicKey: suggestion.magicKey,
            countryCode: 'USA',
          }).then(result => {
            let candidates = result.candidates.map(item => {
              return {
                name: item.address,
                location: { ...item.location },
                extent: { ...item.extent },
                source: SearchTypes.EsriGeocode
              } as Candidate;
            });
            resultsSubject.next(candidates);
          })
        }
      })
      
    })


  }

  public clearCandidates(): void {
    this.setCandidates([]);
  }

}
