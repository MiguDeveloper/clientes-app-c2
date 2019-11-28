import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-directiva',
  templateUrl: './directiva.component.html'
})
export class DirectivaComponent implements OnInit {

  listaCursos: string[] = ['TypeScritp', "JavaScript", 'Java SE' , 'C#', 'PHP'];
  estado: boolean = true;

  constructor() { }

  ngOnInit() {
  }

}
