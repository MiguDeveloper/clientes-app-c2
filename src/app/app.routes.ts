import {RouterModule, Routes} from '@angular/router';
import {AppComponent} from './app.component';
import {ClientesComponent} from './components/clientes/clientes.component';
import {DirectivaComponent} from './components/directiva/directiva.component';


const APP_ROUTES: Routes = [
  {path: 'home', component: ClientesComponent},
  {path: 'clientes', component: ClientesComponent},
  {path: 'directivas', component: DirectivaComponent},
  {path: '', pathMatch: 'full', redirectTo: 'home'},
  {path: '**', pathMatch: 'full', redirectTo: 'home'}
]

export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES);
