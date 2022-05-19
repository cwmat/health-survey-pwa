import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Species } from '../../models/config.model';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-species-card',
  templateUrl: './species-card.component.html',
  styleUrls: ['./species-card.component.scss']
})
export class SpeciesCardComponent implements OnChanges {
  // Config
  isLoading = false;
  hasImage = true;
  imageData: any = null;

  // Inputs
  @Input() species!: Species;

  constructor(
    private api: ApiService,
    private sanitizer: DomSanitizer,
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes, this.species);
    this.handleNewSpecies();
  }

  private handleNewSpecies() {
    this.imageData = null;
    this.isLoading = true;
    this.hasImage = true;

    this.api.getSpeciesImage(this.species?.SpeciesId).subscribe(res => {
      this.isLoading = false;

      if (res.Photo) {
        this.imageData = this.sanitizer.bypassSecurityTrustResourceUrl(`data:${res?.ContentType};base64, ${res?.Photo}`);
        this.hasImage = true;
      } else {
        this.hasImage = false;
      }
    }, error => {
      console.error(error);
      this.isLoading = false;
    });
  }

}
