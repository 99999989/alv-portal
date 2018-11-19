import { Component, Input, OnInit } from '@angular/core';
import { Step } from '../../step-indicator/step.model';

@Component({
  selector: 'alv-company-step-indicator',
  templateUrl: './company-step-indicator.component.html',
  styleUrls: ['./company-step-indicator.component.scss']
})
export class CompanyStepIndicatorComponent {

  @Input() currentStep: number;

  steps: Step[] = [
    {
      label: 'portal.registration.company.step1',
      icon: 'user'
    },
    {
      label: 'portal.registration.company.step2',
      icon: 'envelope'
    },
    {
      label: 'portal.registration.company.step3',
      icon: 'lock'
    }
  ];

  constructor() { }

}
