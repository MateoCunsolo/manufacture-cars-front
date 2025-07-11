import { Component } from '@angular/core';
import { ListCarsComponent } from './components/list-cars/list-cars.component';

@Component({
  selector: 'app-root',
  imports: [ListCarsComponent],
  templateUrl: './app.component.html',
  styles: []
})
export class AppComponent {
  title = 'testing-angular';
}
