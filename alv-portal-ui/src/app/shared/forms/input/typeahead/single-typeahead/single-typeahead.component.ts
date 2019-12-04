import {
  Component,
  ElementRef,
  EventEmitter,
  Host,
  HostBinding,
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
import { Observable } from 'rxjs';
import { NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  startWith,
  switchMap
} from 'rxjs/operators';
import { of } from 'rxjs/internal/observable/of';
import { TypeaheadItem } from '../typeahead-item';
import { ErrorHandlerService } from '../../../../../core/error-handler/error-handler.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'alv-single-typeahead',
  templateUrl: './single-typeahead.component.html',
  styleUrls: ['../../abstract-input.scss', './single-typeahead.component.scss']
})
export class SingleTypeaheadComponent extends AbstractInput implements OnInit {

  /**
   * CSS class providing space for the search icon on the right
   */
  @HostBinding('class.append-button') readonly appendButtonClass = true;

  readonly TYPEAHEAD_QUERY_MIN_LENGTH = 2;

  readonly TYPEAHEAD_DEBOUNCE_TIME = 200;

  @Input() loadItems: (text: string) => Observable<TypeaheadItem<any>[]>;

  @Input() focusFirst = true;

  @Output() itemSelected = new EventEmitter<TypeaheadItem<any>>();

  @ViewChild('inputField', { static: false }) inputFieldRef: ElementRef<HTMLInputElement>;

  helpId = this.id + '-help';

  loadItemsGuardedFn = this.loadItemsGuarded.bind(this);

  controlValueChange$: Observable<string>;

  constructor(@Optional() @Host() @SkipSelf() controlContainer: ControlContainer,
              inputIdGenerationService: InputIdGenerationService,
              private errorHandlerService: ErrorHandlerService
  ) {
    super(controlContainer, InputType.SINGLE_TYPEAHEAD, inputIdGenerationService);
  }

  ngOnInit() {
    super.ngOnInit();
    this.controlValueChange$ = this.control.valueChanges.pipe(
      startWith(this.control.value),
      map(this.formatResultItem),
      distinctUntilChanged()
    );

    this.validationMessages = this.validationMessages || [];
    if (!this.validationMessages || !this.validationMessages.find(validationMessage => validationMessage.error === 'required')) {
      this.validationMessages.push({
        error: 'required',
        message: 'entity.validation.single-typeahead.required'
      });
    }
  }

  formatResultItem(item: TypeaheadItem<any>): string {
    return item ? item.label : '';
  }

  selectItem(event: NgbTypeaheadSelectItemEvent): void {

    const item = <TypeaheadItem<any>>event.item;

    this.control.setValue(item, { emitEvent: true });

    this.itemSelected.emit(item);
  }

  handleInput(): void {
    if (this.control.value) {
      this.control.setValue('', { emitEvent: false });
    }
  }

  private loadItemsGuarded(text$: Observable<string>): Observable<TypeaheadItem<any>[]> {
    return text$.pipe(
      debounceTime(this.TYPEAHEAD_DEBOUNCE_TIME),
      switchMap((query: string) => query.length >= this.TYPEAHEAD_QUERY_MIN_LENGTH
        ? this.loadItems(query).pipe(catchError(this.handleError.bind(this)))
        : of([])),
      map(this.toModelArray.bind(this))
    );
  }

  private toModelArray(items: TypeaheadItem<any>[]): TypeaheadItem<any>[] {
    return items
      .filter((item: TypeaheadItem<any>) => !this.exists(item))
      .sort((item1: TypeaheadItem<any>, item2: TypeaheadItem<any>) => item1.compare(item2));
  }

  private exists(model: TypeaheadItem<any>): boolean {
    return this.control.value && this.control.value === model;
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
