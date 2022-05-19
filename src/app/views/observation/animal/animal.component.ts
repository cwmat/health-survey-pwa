import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subscription } from 'rxjs';
import { debounceTime, first, map, startWith } from 'rxjs/operators';
import { Age, AnimalCount, Captive, Classification, Species, WildlifeStatus, YesNo } from 'src/app/_shared/models/config.model';
import { MagicStrings } from 'src/app/_shared/models/magic-strings.model';
import { Information, ObservationMediaDto } from 'src/app/_shared/models/observation.model';
import { UserMessages } from 'src/app/_shared/models/user-messages.model';
import { ApiService } from 'src/app/_shared/services/api.service';
import { ObservationService } from 'src/app/_shared/services/observation.service';

function autocompleteObjectValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (typeof control.value === 'string') {
      return { 'invalidAutocompleteObject': { value: control.value } }
    }
    return null  /* valid option selected */
  }
}

function autocompleteStringValidator(validOptions: Array<string>): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (validOptions.indexOf(control.value) !== -1) {
      return null  /* valid option selected */
    }
    return { 'invalidAutocompleteString': { value: control.value } }
  }
}

@Component({
  selector: 'app-animal',
  templateUrl: './animal.component.html',
  styleUrls: ['./animal.component.scss'],
  animations: [
    trigger('state', [
        state(MagicStrings.Hidden, style({
            opacity: '0',
        })),
        state(MagicStrings.Visible, style({
          opacity: '1'
        })),
        transition(`* => ${MagicStrings.Visible}`, [animate('500ms ease-out')]),
        transition(`${MagicStrings.Visible} => ${MagicStrings.Hidden}`, [animate('500ms ease-out')])
    ]),
    trigger('animalAlive', [
      state(MagicStrings.Hidden, style({
          opacity: '0',
      })),
      state(MagicStrings.Visible, style({
        opacity: '1'
      })),
      transition(`* => ${MagicStrings.Visible}`, [animate('500ms ease-out')]),
      transition(`${MagicStrings.Visible} => ${MagicStrings.Hidden}`, [animate('500ms ease-out')])
    ]),
    trigger('animalDead', [
      state(MagicStrings.Hidden, style({
          opacity: '0',
      })),
      state(MagicStrings.Visible, style({
        opacity: '1'
      })),
      transition(`* => ${MagicStrings.Visible}`, [animate('500ms ease-out')]),
      transition(`${MagicStrings.Visible} => ${MagicStrings.Hidden}`, [animate('500ms ease-out')])
    ]),
    trigger('speciesSelected', [
      state(MagicStrings.Hidden, style({
          opacity: '0',
      })),
      state(MagicStrings.Visible, style({
        opacity: '1'
      })),
      transition(`* => ${MagicStrings.Visible}`, [animate('500ms ease-out')]),
      transition(`${MagicStrings.Visible} => ${MagicStrings.Hidden}`, [animate('500ms ease-out')])
    ]),
    trigger('mammalSelected', [
      state(MagicStrings.Hidden, style({
          opacity: '0',
      })),
      state(MagicStrings.Visible, style({
        opacity: '1'
      })),
      transition(`* => ${MagicStrings.Visible}`, [animate('500ms ease-out')]),
      transition(`${MagicStrings.Visible} => ${MagicStrings.Hidden}`, [animate('500ms ease-out')])
    ]),
  ]
})
export class AnimalComponent implements OnInit, OnDestroy {
  // Config
  header = MagicStrings.AnimalHeader;
  content = UserMessages.AnimalHelperText;
  photosHeader = MagicStrings.PhotosHeader;
  photosContent = UserMessages.PhotosHelperText;
  state = MagicStrings.Hidden;
  animalAlive = MagicStrings.Hidden;
  animalDead = MagicStrings.Hidden;
  speciesSelected = MagicStrings.Hidden;
  mammalSelected = MagicStrings.Hidden;
  filteredSpeciesOptions!: Observable<Species[]> | undefined;

  // Forms
  animalForm = new FormGroup({
    date: new FormControl('', [
      Validators.required,
    ]),
    numberOfAnimals: new FormControl('', [
      Validators.required,
    ]),
    species: new FormControl('', [
      Validators.required,
      autocompleteObjectValidator(),
    ]),
    alive: new FormControl('', [
      Validators.required,
    ]),
    sickOrInjured: new FormControl('', [
    ]),
    inYourPossession: new FormControl('', [
    ]),
    poaching: new FormControl('', [
    ]),
    age: new FormControl('', [
      Validators.required,
    ]),
    captiveWild: new FormControl('', [
      Validators.required,
    ]),
    rabies: new FormControl('', [
    ]),
    zoonotic: new FormControl('', [
      Validators.required,
    ]),
    details: new FormControl('', [
      Validators.maxLength(1500),
    ]),
  });

  // Dropdowns
  numberOfAnimalsList: AnimalCount[] = [];
  speciesList: Species[] = [];
  yesNoList: YesNo[] = [];
  ageList: Age[] = [];
  captiveList: Captive[] = [];
  classificationList: Classification[] = [];
  wildlifeStatusList: WildlifeStatus[] = [];

  // Refs
  refYes = MagicStrings.RefLookupYes;
  refNo = MagicStrings.RefLookupNo;
  refAlive = MagicStrings.RefLookupAlive;
  refMammal = MagicStrings.RefLookupMammal;

  // Popup messages
  messageRabies = UserMessages.RabiesPopup;
  messagePoaching = UserMessages.PoachingPopup;

  // Date Validation
  maxDate = new Date();
  minDate = new Date();

  // Subscriptions
  formChangeSub!: Subscription;

  // Outputs
  @Output() isValid = new EventEmitter<boolean>(false);

  constructor(
    public obsStore: ObservationService,
    public api: ApiService,
    private _snackBar: MatSnackBar,
  ) { 
    this.minDate.setMonth(new Date().getMonth() - 6)
  }

  ngOnInit(): void {
    // Sub to form changes to update store on valid entries
    this.formChangeSub = this.animalForm.valueChanges
      .pipe(
        debounceTime(200)
      )
      .subscribe({
          next: (data) => {
            this.obsStore.getObservation()
              .pipe(first())
              .subscribe(res => {
                if (this.animalForm.valid) {
                  const newData = { ...res };
                  newData.information = { ...data as Information};
                  const speciesData = newData.information?.species as Species || null;
                  newData.information.species = speciesData?.SpeciesId;
                  this.obsStore.updateObservation(newData);
                }
                this.isValid.emit(this.animalForm.valid);
                this.checkHiddenFields();
              });
          }
      });

    // Init dropdowns
    this.initializeDropdowns();
  }

  ngOnDestroy() {
    this.formChangeSub.unsubscribe();
  }

  get date() { return this.animalForm.get('date'); }

  get species() { return this.animalForm.get('species'); }

  get numberOfAnimals() { return this.animalForm.get('numberOfAnimals'); }

  get alive() { return this.animalForm.get('alive'); }

  get sickOrInjured() { return this.animalForm.get('sickOrInjured'); }

  get inYourPossession() { return this.animalForm.get('inYourPossession'); }

  get poaching() { return this.animalForm.get('poaching'); }

  get age() { return this.animalForm.get('age'); }

  get captiveWild() { return this.animalForm.get('captiveWild'); }

  get rabies() { return this.animalForm.get('rabies'); }

  get zoonotic() { return this.animalForm.get('zoonotic'); }

  get details() { return this.animalForm.get('details'); }

  initializeDropdowns() {
      // Animal Count
      this.api.getAnimalCount().subscribe(res => {
        this.numberOfAnimalsList = res;
      },
      error => {
        console.error(error);
      });

      // Species
      this.api.getSpecies().subscribe(res => {
        this.speciesList = res;
        this._setupSpeciesEvent();
      },
      error => {
        console.error(error);
      });

      // Yes/No
      this.api.getYesNo().subscribe(res => {
        this.yesNoList = res;
      },
      error => {
        console.error(error);
      });

      // Age
      this.api.getAge().subscribe(res => {
        this.ageList = res;
      },
      error => {
        console.error(error);
      });

      // Captive
      this.api.getCaptive().subscribe(res => {
        this.captiveList = res;
      },
      error => {
        console.error(error);
      });

      // Classification
      this.api.getClassification().subscribe(res => {
        this.classificationList = res;
      },
      error => {
        console.error(error);
      });

      // Wildlife Status
      this.api.getWildlifeStatus().subscribe(res => {
        this.wildlifeStatusList = res;
      },
      error => {
        console.error(error);
      });
  }

  checkHiddenFields() {
    // Show main form
    if (this.state === MagicStrings.Hidden && this.date?.valid && this.numberOfAnimals?.valid) {
      this.state = MagicStrings.Visible;
    }

    // Animal Alive
    if (this.alive?.valid && this.alive?.value === this.refAlive) {
      // Animations
      this.animalAlive = MagicStrings.Visible;
      this.animalDead = MagicStrings.Hidden;

      // Change validation
      this.sickOrInjured?.setValidators([Validators.required]);
      this.inYourPossession?.setValidators([Validators.required]);
      this.poaching?.setValidators([]);

      // Update validation
      this.sickOrInjured?.updateValueAndValidity();
      this.inYourPossession?.updateValueAndValidity();
      this.poaching?.updateValueAndValidity();

      // Clear data
      this.poaching?.reset();
    } else if (this.alive?.valid && this.alive?.value !== this.refAlive) {
      // Animations
      this.animalAlive = MagicStrings.Hidden;
      this.animalDead = MagicStrings.Visible;

      // Change validation
      this.sickOrInjured?.setValidators([Validators.required]);
      this.inYourPossession?.setValidators([Validators.required]);
      this.poaching?.setValidators([Validators.required]);

      // Update validation
      this.sickOrInjured?.updateValueAndValidity();
      this.inYourPossession?.updateValueAndValidity();
      this.poaching?.updateValueAndValidity();
    } else {
      // Animations
      this.animalAlive = MagicStrings.Hidden;
      this.animalDead = MagicStrings.Hidden;

      // Change validation
      this.sickOrInjured?.setValidators([Validators.required]);
      this.inYourPossession?.setValidators([]);
      this.poaching?.setValidators([]);

      // Update validation
      this.sickOrInjured?.updateValueAndValidity();
      this.inYourPossession?.updateValueAndValidity();
      this.poaching?.updateValueAndValidity();

      // Clear data
      this.poaching?.reset();
      this.inYourPossession?.reset();
    }

    // Species Selected
    if (this.species?.valid) {
      // Animations
      this.speciesSelected = MagicStrings.Visible;

      if (this.speciesCodeIsMammal(this.species?.value)) {
        this.mammalSelected = MagicStrings.Visible;
        this.rabies?.setValidators([Validators.required]);
        this.rabies?.updateValueAndValidity();
      } else {
        this.mammalSelected = MagicStrings.Hidden;
        this.rabies?.setValidators([]);
        this.rabies?.updateValueAndValidity();
        this.rabies?.reset();
      }
    }
  }

  public speciesCodeIsMammal(species: Species): boolean {
    if (species.ClassificationId === this.refMammal)
      return true;
    else
      return false;
  }

  openSnackBar(message: string, action: string = 'Close') {
    this._snackBar.open(message, action);
  }

  mediaDataChanged(data: ObservationMediaDto[]) {
    this.obsStore.updateObservationMedia(data)
  }

  getSpeciesDisplay(option: Species) {
    return option?.Name || '';
  }

  private _filterSpecies(value: string): Species[] {
    if (typeof value !== 'string')
      return [];

    const filterValue = value.toLowerCase();
    return this.speciesList.filter(option => {
      const extractName = option?.Name || '';
      return extractName.toLowerCase().includes(filterValue)
    });
  }

  private _setupSpeciesEvent() {
    // Species form type ahead
    this.filteredSpeciesOptions = this.species?.valueChanges.pipe(
      debounceTime(200),
      startWith(''),
      map(value => this._filterSpecies(value)),
    );
  }

}
