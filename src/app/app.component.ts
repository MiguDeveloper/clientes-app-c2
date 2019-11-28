import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  curso: string = 'angular básico';
  titulo: string = 'Bienvenido al curso';
  profesor: string = 'Miguel Chinchay';
}
