import {RouterModule, Routes} from '@angular/router';
import {AppComponent} from './app.component';
import {ClientesComponent} from './components/clientes/clientes.component';
import {DirectivaComponent} from './components/directiva/directiva.component';
import {FormComponent} from './components/clientes/form.component';


const APP_ROUTES: Routes = [
  {path: 'home', component: ClientesComponent},
  {path: 'clientes', component: ClientesComponent},
  {path: 'clientes/page/:page', component: ClientesComponent},
  {path: 'directivas', component: DirectivaComponent},
  {path: 'clientes/form', component: FormComponent},
  {path: 'clientes/form/:id', component: FormComponent},
  {path: '', pathMatch: 'full', redirectTo: 'home'},
  {path: '**', pathMatch: 'full', redirectTo: 'home'}
];

export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES);
