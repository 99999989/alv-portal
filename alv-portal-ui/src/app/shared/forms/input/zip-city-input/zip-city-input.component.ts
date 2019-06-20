import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IsoCountryService } from '../../../localities/iso-country.service';
import { LocalitySuggestionService } from '../../../localities/locality-suggestion.service';
import { Observable } from 'rxjs';
import { TypeaheadItem } from '../typeahead/typeahead-item';
import { ZipAndCity } from '../../../localities/zip-and-city-typeahead-item';
import { ZipCityFormValue, ZipCityValidators } from './zip-city-form-value.types';

export const zipCityInputSettings = {
  CITY_MAX_LENGTH: 100,
  ZIP_CODE_MAX_LENGTH: 12
};

export const zipCityDefaultValidators: ZipCityValidators = {
    zipCityAutoComplete: [Validators.required],
    zipCode: [
      Validators.required,
      Validators.maxLength(zipCityInputSettings.ZIP_CODE_MAX_LENGTH)
    ],
    city: [
      Validators.required,
      Validators.maxLength(zipCityInputSettings.CITY_MAX_LENGTH)
    ]
  }
;
@Component({
  selector: 'alv-zip-city-input',
  templateUrl: './zip-city-input.component.html',
  styleUrls: ['./zip-city-input.component.scss']
})
export class ZipCityInputComponent implements OnInit {

  readonly CITY_MAX_LENGTH = zipCityInputSettings.CITY_MAX_LENGTH;
  readonly ZIP_CODE_MAX_LENGTH = zipCityInputSettings.ZIP_CODE_MAX_LENGTH;
  @Input()
  parentForm: FormGroup;
  @Input()
  zipCityFormValue: ZipCityFormValue;
  @Input()
  defaultValidators = zipCityDefaultValidators;
  zipAndCity: FormGroup;

  constructor(private fb: FormBuilder,
              private localitySuggestionService: LocalitySuggestionService) {
  }

  private _countryIsoCode: string;

  @Input()
  set countryIsoCode(countryIsoCode: string) {

    this._countryIsoCode = countryIsoCode;
    if (this.zipAndCity) {
      this.toggleAutocomplete(countryIsoCode);
    }
  }

  private static isCityZipAutocomplete(selectedCountryIsoCode: string) {
    return selectedCountryIsoCode === IsoCountryService.ISO_CODE_SWITZERLAND;
  }

  public loadLocations(query: string): Observable<TypeaheadItem<ZipAndCity>[]> {
    return this.localitySuggestionService.fetchJobPublicationLocations(query);
  }

  ngOnInit(): void {
    const {zipCityAutoComplete, zipCode, city} = this.zipCityFormValue;

    this.zipAndCity = this.fb.group({
      zipCityAutoComplete: [zipCityAutoComplete, this.defaultValidators.zipCityAutoComplete],
      zipCode: [zipCode, this.defaultValidators.zipCode],
      city: [city, this.defaultValidators.city]
    });
    this.parentForm.addControl('zipAndCity', this.zipAndCity);
    this.toggleAutocomplete(this._countryIsoCode);
  }

  public isCityZipAutocomplete() {
    return ZipCityInputComponent.isCityZipAutocomplete(this._countryIsoCode);
  }

  private toggleAutocomplete(selectedCountryIsoCode: string) {
    const zipCityAutoCompleteControl = this.zipAndCity.get('zipCityAutoComplete');
    const zipCodeControl = this.zipAndCity.get('zipCode');
    const cityControl = this.zipAndCity.get('city');

    if (ZipCityInputComponent.isCityZipAutocomplete(selectedCountryIsoCode)) {
      zipCityAutoCompleteControl.enable();

      zipCodeControl.disable();
      cityControl.disable();
    } else {
      zipCityAutoCompleteControl.disable();

      zipCodeControl.enable();
      cityControl.enable();
    }
  }

}
