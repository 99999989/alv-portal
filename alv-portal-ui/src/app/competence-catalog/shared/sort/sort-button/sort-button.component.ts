import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalService } from '../../../../shared/layout/modal/modal.service';
import { CompetenceCatalogSortModalComponent } from '../competence-catalog-sort-modal/competence-catalog-sort-modal.component';
import { CompetenceCatalogSortValue } from '../../shared-competence-catalog.types';

@Component({
  selector: 'alv-sort-button',
  templateUrl: './sort-button.component.html',
  styleUrls: ['./sort-button.component.scss']
})
export class SortButtonComponent implements OnInit {

  @Input()
  currentSorting: CompetenceCatalogSortValue;

  @Output()
  sortClicked = new EventEmitter<CompetenceCatalogSortValue>();

  constructor(private modalService: ModalService) {
  }

  ngOnInit() {
  }

  onClick() {
      const modalRef = this.modalService.openMedium(CompetenceCatalogSortModalComponent);
      modalRef.componentInstance.currentSorting = this.currentSorting;
      modalRef.result
        .then(updatedSorting => {
          this.sortClicked.emit(updatedSorting);
        })
        .catch(() => {
        });
  }

}
