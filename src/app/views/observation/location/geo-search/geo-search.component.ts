import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Candidate, Candidates, SearchTypes } from './geo-search.model';
import { GeoSearchService } from './geo-search.service';

@Component({
  selector: 'app-geo-search',
  templateUrl: './geo-search.component.html',
  styleUrls: ['./geo-search.component.scss']
})
export class GeoSearchComponent implements OnInit, OnDestroy {
  searchCtrl = new FormControl();

  candidates: Candidate[] = [];

  tooltipMessage = '';

  @Input() mapCenter: any = { x: -77.1945, y: 41.2033 }; // Rough Center of PA

  @Output() zoomToCandidates: EventEmitter<Candidates> = new EventEmitter();

  @Output() clearPoints: EventEmitter<void> = new EventEmitter();

  private valuesChange$!: Subscription;

  private newCandidates$!: Subscription;

  constructor(
    private geoSearchService: GeoSearchService
  ) { }

  ngOnInit(): void {
    this.newCandidates$ = this.geoSearchService.getCandidates().subscribe(candidates => {
      this.candidates = candidates;
    });

    this.valuesChange$ = this.searchCtrl.valueChanges
    .pipe(
      debounceTime(200)
    )
    .subscribe(_ => {
      let value = this.searchCtrl.value
      if (value === '' || !value) {
        this.geoSearchService.clearCandidates();
      }
      this.geoSearchService.searchCandidates(value, [this.mapCenter.x, this.mapCenter.y]);
    });
  }

  ngOnDestroy(): void {
    this.valuesChange$.unsubscribe();
    this.newCandidates$.unsubscribe();
  }

  goToLocation(selectedCandidate: Candidate): void {
    // @ts-ignore
    const foundCandidate: Candidate = this.candidates.find(
      candidate => candidate.name === selectedCandidate.name &&
        candidate.location.x === selectedCandidate.location.x &&
        candidate.location.y === selectedCandidate.location.y);

    const leftOffset = 0;

    if (foundCandidate.source === SearchTypes.DDCoordinate) {
      const coordCandidate = {
        candidates: [foundCandidate],
        paddingLeft: leftOffset,
        paddingBottom: 0
      } as Candidates;
      this.zoomToCandidates.emit(coordCandidate);
    } else {
      const foundCandidates = {
        candidates: [foundCandidate],
        paddingLeft: leftOffset,
        paddingBottom: 0
      } as Candidates;
      this.zoomToCandidates.emit(foundCandidates);
    }
  }

  clearValues() {
    this.searchCtrl.setValue('');
    this.clearPoints.emit();
  }

  getOptionName(data: Candidate): string {
    if (data) {
      return data.name;
    } else {
      // @ts-ignore
      return null;
    }
  }

}
