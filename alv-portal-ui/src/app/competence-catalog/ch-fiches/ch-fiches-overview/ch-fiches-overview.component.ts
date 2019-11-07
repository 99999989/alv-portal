import { Component } from '@angular/core';

@Component({
  selector: 'alv-ch-fiches-overview',
  templateUrl: './ch-fiches-overview.component.html',
  styleUrls: ['./ch-fiches-overview.component.scss']
})
export class ChFichesOverviewComponent extends OverviewComponent<ChFiche> implements OnInit {


  constructor(protected itemsRepository: ChFicheRepository,
              private fb: FormBuilder,
              private router: Router,
              private route: ActivatedRoute,
              protected authenticationService: AuthenticationService,
              private occupationSuggestionService: OccupationSuggestionService) {
    super(authenticationService, itemsRepository);
  }

  ngOnInit() {
    super.ngOnInit();
  }


  editChFiche(chFiche: ChFiche) {
    this.router.navigate(['edit', chFiche.id], { relativeTo: this.route });
  }

}
