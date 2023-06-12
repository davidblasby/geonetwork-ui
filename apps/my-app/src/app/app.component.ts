import { Component } from '@angular/core'
import { FieldsService } from '@geonetwork-ui/feature/search'

@Component({
  selector: 'geonetwork-ui-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'my-app'


  constructor(private service: FieldsService) {}


}
