import { Component, Input, OnInit } from '@angular/core';
import { ApiUser } from '../../../shared/backend-services/api-user-management/api-user-management.types';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiUserManagementRepository } from '../../../shared/backend-services/api-user-management/api-user-management-repository';
import { patternInputValidator } from '../../../shared/forms/input/input-field/pattern-input.validator';
import { EMAIL_REGEX } from '../../../shared/forms/regex-patterns';
import { take } from 'rxjs/operators';
import { emailInputValidator } from '../../../shared/forms/input/input-field/email-input.validator';

@Component({
  selector: 'alv-api-user-modal',
  templateUrl: './api-user-modal.component.html'
})
export class ApiUserModalComponent implements OnInit {

  readonly inputFields = [
    'username',
    'companyName',
    'companyEmail',
    'technicalContactName',
    'technicalContactEmail'];

  @Input()
  apiUser: ApiUser;

  form: FormGroup;

  constructor(private fb: FormBuilder,
              public activeModal: NgbActiveModal,
              private apiUserManagementRepository: ApiUserManagementRepository) { }

  ngOnInit() {
    this.form = this.fb.group({
      username: [null, Validators.required],
      companyName: [null, Validators.required],
      companyEmail: [null, [Validators.required, emailInputValidator()]],
      technicalContactName: [null, Validators.required],
      technicalContactEmail: [null, [Validators.required, emailInputValidator()]]
    });

    this.patchFormValues();
  }

  onDismiss() {
    this.activeModal.close(null);
  }

  onSubmit() {
    const user = this.mapFormValuesToApiUser(this.form.value);
    if (this.apiUser) {
      this.apiUserManagementRepository.update({...user, id: this.apiUser.id})
        .pipe(
          take(1))
        .subscribe((updatedUser) => this.activeModal.close(updatedUser), () => this.activeModal.close(null));
    } else {
      this.apiUserManagementRepository.save(user)
        .pipe(
          take(1))
        .subscribe((updatedUser) => this.activeModal.close(updatedUser), () => this.activeModal.close(null));
    }
  }

  generatePassword(): void {
    this.form.get('password').setValue(
      this.apiUserManagementRepository.generatePassword());
  }

  private mapFormValuesToApiUser(formValue: any): ApiUser {
    return {
      username: formValue.username,
      companyName: formValue.companyName,
      companyEmail: formValue.companyEmail,
      technicalContactName: formValue.technicalContactName,
      technicalContactEmail: formValue.technicalContactEmail,
      password: formValue.password,
      active: formValue.active
    };
  }

  private patchFormValues(): void {
    if (!this.apiUser) {
      this.form.addControl('password', this.fb.control(null, Validators.required));
      this.form.addControl('active', this.fb.control(true));
    } else {
      this.form.patchValue({
        username: this.apiUser.username,
        companyName: this.apiUser.companyName,
        companyEmail: this.apiUser.companyEmail,
        technicalContactName: this.apiUser.technicalContactName,
        technicalContactEmail: this.apiUser.technicalContactEmail
      });
    }
  }

}
