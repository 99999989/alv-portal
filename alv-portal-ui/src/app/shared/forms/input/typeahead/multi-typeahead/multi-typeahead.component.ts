import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Host,
  Inject,
  Input,
  OnInit,
  Optional,
  Output,
  SkipSelf,
  ViewChild
} from '@angular/core';
import { AbstractInput } from '../../abstract-input';
import { ControlContainer } from '@angular/forms';
import { InputIdGenerationService } from '../../input-id-generation.service';
import { InputType } from '../../input-type.enum';
import { EMPTY, Observable } from 'rxjs';
import { TypeaheadItem } from '../typeahead-item';

import { catchError, debounceTime, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs/internal/observable/of';
import { DOCUMENT } from '@angular/common';
import { StringTypeaheadItem } from '../string-typeahead-item';
import { TypeaheadDisplayItem } from '../typeahead-display-item';
import { ErrorHandlerService } from '../../../../../core/error-handler/error-handler.service';
import { HttpErrorResponse } from '@angular/common/http';
import { WINDOW } from '../../../../../core/window.service';
import {
  NgbTooltip,
  NgbTypeahead,
  NgbTypeaheadSelectItemEvent,
  Placement
} from '@ng-bootstrap/ng-bootstrap';

export const TYPEAHEAD_QUERY_MIN_LENGTH = 2;

enum Key {
  Backspace = 8,
  Tab = 9,
  Enter = 13,
}

@Component({
  selector: 'alv-multi-typeahead',
  templateUrl: './multi-typeahead.component.html',
  styleUrls: ['../../abstract-input.scss', './multi-typeahead.component.scss']
})
export class MultiTypeaheadComponent extends AbstractInput implements OnInit, AfterViewInit {

  readonly TYPEAHEAD_DEBOUNCE_TIME = 200;

  @Input() loadItems: (text: string) => Observable<TypeaheadItem<any>[]>;

  @Input() editable = true;

  @Input() focusFirst = false;

  @Input() limit = 0;

  @Input() queryMinLength = TYPEAHEAD_QUERY_MIN_LENGTH;

  /**
   * The text of the tooltip. Other tooltip options won't have any effect without this one
   */
  @Input() tooltip: string;

  /**
   * See the documentation for ng-bootstrap tooltip
   */
  @Input() tooltipContainer = 'body';

  /**
   * See the documentation for ng-bootstrap tooltip
   */
  @Input() tooltipPlacement: Placement = 'bottom';

  @Output() itemSelected = new EventEmitter<TypeaheadItem<any>>();

  @ViewChild(NgbTypeahead, { static: false }) ngbTypeahead: NgbTypeahead;

  @ViewChild(NgbTooltip, { static: false }) ngbTooltip: NgbTooltip;

  inputValue: string;

  loadItemsGuardedFn = this.loadItemsGuarded.bind(this);

  allyHelpId: string;

  constructor(@Optional() @Host() @SkipSelf() controlContainer: ControlContainer,
              inputIdGenerationService: InputIdGenerationService,
              @Inject(DOCUMENT) private document: any,
              @Inject(WINDOW) private window: Window,
              private elRef: ElementRef,
              private errorHandlerService: ErrorHandlerService) {
    super(controlContainer, InputType.MULTI_TYPEAHEAD, inputIdGenerationService);
  }


  ngOnInit() {
    super.ngOnInit();
    if (!this.loadItems) {
      this.loadItems = () => {
        return EMPTY;
      };
    }
    this.allyHelpId = `${this.id}-ally-help`;

    this.validationMessages = this.validationMessages || [];
    if (!this.validationMessages.find(validationMessage => validationMessage.error === 'required')) {
      this.validationMessages.push({
        error: 'required',
        message: 'entity.validation.multi-typeahead.required'
      });
    }
  }

  ngAfterViewInit() {
    this.overrideOpenPopup();
  }

  showPlaceholder(): boolean {
    return !this.inputValue && (!this.control.value || this.control.value && this.control.value.length === 0);
  }

  formatResultItem(item: TypeaheadItem<any>): string {
    return item.label;
  }

  getTypeClass(item: TypeaheadItem<any>): string {
    return `badge-${item.type}`;
  }

  hasFocus(): boolean {
    if (this.document.activeElement && this.id) {
      //in IE11 if the tooltip is set, the activeElement can be null
      return this.document.activeElement.id === this.id;
    }
    return false;
  }

  getInputWidth(): string {
    const value = this.inputValue || '';
    if (value.length > 10) {
      return '100%';
    }
    if (value.length > 0) {
      return `${value.length}em`;
    }
    if (this.control.value && this.control.value.length > 0) {
      return '0.5em';
    }
    return '100%';
  }

  onBlur(control) {
    control.markAsTouched();
    this.selectFreeText();
  }

  handleKeyDown(event: KeyboardEvent): void {

    const key = event.code || event.key;
    if (key === 'Enter' || key === 'Tab') {
      const hasEnteredValue = !!this.inputValue;
      const validFreeTextEntry = !!this.selectFreeText();
      if (validFreeTextEntry) {
        this.preventAndStopPropagation(event);
      } else {
        this.clearInput();
        if (key === 'Enter' && hasEnteredValue) {
          this.preventAndStopPropagation(event);
        }
      }
      return;
    }
    if (key === 'Backspace') {
      if (!this.inputValue && this.control.value && this.control.value.length) {
        const result = [...this.control.value];
        result.splice(-1, 1);
        this.control.setValue(result);
      }
      return;
    }
    if (this.itemLimitReached()) {
      // when the limit is reached you can't type anymore
      event.preventDefault();
      return;
    }
  }

  selectItem(event: NgbTypeaheadSelectItemEvent): void {
    // preventDefault() has to be called to suppress the default selection behaviour of ng-bootstrap
    // (puts the item in the input field)
    event.preventDefault();

    if (this.itemLimitReached()) {
      return;
    }
    this.control.setValue([...this.control.value || [], event.item.model]);

    this.itemSelected.emit(event.item.model);

    this.clearInput();
    this.getTypeaheadNativeElement().focus();
  }

  selectFreeText(): TypeaheadItem<any> {
    if (this.itemLimitReached()
      || !this.editable
      || !this.inputValue
      || this.inputValue.length < this.queryMinLength) {
      this.clearInput();
      return null;
    }
    const freeTextItem = new StringTypeaheadItem(
      'free-text',
      this.inputValue,
      this.inputValue
    );
    if (this.exists(freeTextItem)) {
      return null;
    }
    this.control.setValue([...this.control.value || [], freeTextItem]);
    this.clearInput();
    return freeTextItem;
  }

  removeItem(item: TypeaheadItem<any>): void {
    this.control.setValue(this.control.value.filter((i) => !item.equals(i)));
    this.clearInput();
    this.getTypeaheadNativeElement().focus();
  }

  /**
   * Here we override the private _openPopup function of the ngb-typeahead which is
   * dangerous. We try to contribute to the library to make this officially supported.
   * TODO: Adapt to the official solution as soon as one is provided
   */
  private overrideOpenPopup() {
    const originalOpenPopup = this.ngbTypeahead['_openPopup'].bind(this.ngbTypeahead);
    this.ngbTypeahead['_openPopup'] = () => {
      originalOpenPopup();
      this.getPopupWindowElement().style.opacity = 0;
      setTimeout(() => {
        this.calculateDropdownHeight();
        this.getPopupWindowElement().style.opacity = 1;
      });

    };
  }

  private calculateDropdownHeight() {
    if (this.ngbTypeahead.isPopupOpen()) {
      const dropdownElement = this.getPopupWindowElement();
      // Reset the dropdown height
      dropdownElement.style.height = 'unset';
      const dropdownRect = dropdownElement.getBoundingClientRect();
      const footerHeight = 20;
      // Calculate the visible height: body height - scroll distance - footer height
      const visibleHeight = this.document.body.clientHeight - this.window.pageYOffset - footerHeight;
      if (dropdownRect.bottom > visibleHeight) {
        const overflowHeight = dropdownRect.bottom - visibleHeight + footerHeight;
        dropdownElement.style.maxHeight = `${dropdownRect.height - overflowHeight}px`;
      }
    }
  }

  private getPopupWindowElement() {
    return this.document.querySelector('ngb-typeahead-window');
  }

  private preventAndStopPropagation(event: KeyboardEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  private loadItemsGuarded(text$: Observable<string>): Observable<TypeaheadDisplayItem[]> {
    return text$.pipe(
      debounceTime(this.TYPEAHEAD_DEBOUNCE_TIME),
      switchMap((query: string) => query.length >= this.queryMinLength
        ? this.loadItems(query).pipe(catchError(this.handleError.bind(this)))
        : of([])),
      tap(() => this.calculateDropdownHeight()),
      map(this.toDisplayModelArray.bind(this))
    );
  }

  private toDisplayModelArray(items: TypeaheadItem<any>[]): TypeaheadDisplayItem[] {
    return items
      .filter((item: TypeaheadItem<any>) => !this.exists(item))
      .sort((item1: TypeaheadItem<any>, item2: TypeaheadItem<any>) => item1.compare(item2))
      .map(this.toDisplayModel);
  }

  private toDisplayModel(item: TypeaheadItem<any>, idx: number, array: TypeaheadItem<any>[]): TypeaheadDisplayItem {
    let firstInGroup = false;
    if (idx === 0 || item.type !== array[idx - 1].type) {
      firstInGroup = true;
    }
    return new TypeaheadDisplayItem(item, idx === 0, firstInGroup);
  }

  private exists(model: TypeaheadItem<any>): boolean {
    return this.control.value && !!this.control.value.find((itemModel) => model.equals(itemModel));
  }

  private itemLimitReached(): boolean {
    return this.limit && this.control.value && this.control.value.length >= this.limit;
  }

  private clearInput(): void {
    /* tslint:disable */
    // FIXME This hack removes the invalid value from the input field on blur.
    this.ngbTypeahead['_inputValueBackup'] = '';
    this.inputValue = '';
    /* tslint:enable */
  }

  private getTypeaheadNativeElement(): any {
    /* tslint:disable */
    return this.ngbTypeahead && this.ngbTypeahead['_elementRef'].nativeElement || {};
    /* tslint:enable */
  }

  private handleError(error: any) {
    if (error instanceof HttpErrorResponse) {
      this.errorHandlerService.handleHttpError(error);
    } else {
      this.errorHandlerService.handleError(error);
    }

    return of([]);
  }

}
