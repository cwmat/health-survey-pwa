import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, first } from 'rxjs/operators';
import { Affiliation } from 'src/app/_shared/models/config.model';
import { MagicStrings } from 'src/app/_shared/models/magic-strings.model';
import { Contact } from 'src/app/_shared/models/observation.model';
import { UserMessages } from 'src/app/_shared/models/user-messages.model';
import { ApiService } from 'src/app/_shared/services/api.service';
import { ObservationService } from 'src/app/_shared/services/observation.service';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit, OnDestroy {
  // Config
  header = MagicStrings.ContactHeader;
  content = UserMessages.ContactHelperText;

  // Forms
  contactForm = new FormGroup({
    name: new FormControl('', [
      Validators.maxLength(50),
    ]),
    affiliation: new FormControl('', [
    ]),
    email: new FormControl('', [
      Validators.maxLength(50),
      Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
    ]),
    phone: new FormControl('', [
      Validators.maxLength(14),
      Validators.minLength(14),
    ]),
  });

  // Dropdowns
  affiliations: Affiliation[] = [];

  // Subscriptions
  formChangeSub!: Subscription;

  // Outputs
  @Output() isValid = new EventEmitter<boolean>(false);

  constructor(
    public obsStore: ObservationService,
    public api: ApiService,
  ) { }

  ngOnInit(): void {
    // Sub to form changes to update store on valid entries
    this.formChangeSub = this.contactForm.valueChanges
      .pipe(
        debounceTime(200)
      )
      .subscribe({
          next: (contact) => {
            this.obsStore.getObservation()
              .pipe(first())
              .subscribe(res => {
                if (this.contactForm.valid) {
                  const newData = { ...res };
                  const cleanPhone = parseInt(
                    contact.phone
                      .replace(')', '')
                      .replace('(', '')
                      .replace(' ', '')
                      .replace('-', '')
                  );
                  contact.phone = cleanPhone;
                  newData.contact = { ...contact as Contact};
                  this.obsStore.updateObservation(newData);
                }
                this.isValid.emit(this.contactForm.valid);
              });
          }
      });

    // Init dropdowns
    this.initializeDropdowns();
  }

  ngOnDestroy() {
    this.formChangeSub.unsubscribe();
  }

  get name() { return this.contactForm.get('name'); }

  get affiliation() { return this.contactForm.get('affiliation'); }

  get email() { return this.contactForm.get('email'); }

  get phone() { return this.contactForm.get('phone'); }

  initializeDropdowns() {
      this.api.getAffiliation().subscribe(res => {
        this.affiliations = res;
        this.affiliations.sort((a, b) => ((a?.Name || 0) > (b?.Name || 0)) ? 1 : -1);
        const found = this.affiliations.find(e => e.RefTableDataId === MagicStrings.RefLookupPublicAffiliation);
        if (found)
          this.affiliation?.setValue(found.RefTableDataId);
      },
      error => {
        console.error(error);
      });
  }

}
