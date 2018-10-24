import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'alv-find-job-home-widget',
  templateUrl: './find-job-home-widget.component.html',
  styleUrls: ['./find-job-home-widget.component.scss']
})
export class FindJobHomeWidgetComponent implements OnInit {

  findJobForm: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.findJobForm = this.fb.group({
      profession: this.fb.control(''),
      skills: this.fb.control(''),
      city: this.fb.control('')
    });
  }

}