import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

/**
 * Component to create custom modals after the styleguide
 * @example see local-login.component.html
 */
@Component({
  selector: 'alv-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {

  /**
   * Title of the modal
   */
  @Input() modalTitle: string;

  /**
   * (optional) Icon of the modal
   */
  @Input() icon?: string;

  /**
   * (optional) Subtitle of the modal
   */
  @Input() subtitle?: string;

  /**
   * (optional) Label of the primary button
   */
  @Input() primaryLabel?: string;

  /**
   * (optional) attribute to set visibility of primary action, default true
   */
  @Input() showPrimaryButton = true;

  /**
   * (optional) attribute to set disabled state of primary action
   */
  @Input() primaryButtonDisabled?: boolean;

  /**
   * Emitted event on primary button click.
   */
  @Output() primaryAction = new EventEmitter<void>();

  /**
   * (optional) Label of the cancel button
   */
  @Input() cancelLabel?: string;

  /**
   * Emitted event on cancel button click.
   */
  @Output() cancelAction = new EventEmitter<void>();

  /**
   * (optional) Label of the secondary button
   */
  @Input() secondaryLabel?: string;

  /**
   * Emitted event on secondary button click.
   */
  @Output() secondaryAction = new EventEmitter<void>();

  /**
   * If the custom modal contains a form, just set the formGroup to wrap the whole modal
   * content in a form element to enable the form submit behaviour for the primary button.
   */
  @Input() formGroup?: FormGroup;

  /**
   * (optional) attribute to set visibility of close button, default true
   */
  @Input() showCloseButton = true;

  /**
   * (optional) pass subscription to disable modal buttons while it is not completed
   */
  @Input() loadingSubscription?: Subscription;

  constructor() {
  }

  handlePrimaryClick() {
    if (!this.formGroup) {
      this.handleSubmitClick();
    } else if (this.formGroup.invalid) {
      this.formGroup.updateValueAndValidity();
    }
  }

  handleSubmitClick() {
    this.primaryAction.emit();
  }

  handleCancelClick() {
    this.cancelAction.emit();
  }

  handleSecondaryClick() {
    this.secondaryAction.emit();
  }

  isLoading(): boolean {
    return this.loadingSubscription && !this.loadingSubscription.closed;
  }
}
