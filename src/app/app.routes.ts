import {RouterModule, Routes} from '@angular/router';
import {AppComponent} from './app.component';
import {ClientesComponent} from './components/clientes/clientes.component';
import {DirectivaComponent} from './components/directiva/directiva.component';
import {FormComponent} from './components/clientes/form.component';
import {DetalleComponent} from './components/clientes/detalle/detalle.component';
import {LoginComponent} from './components/login/login.component';
import {AuthGuard} from './components/login/guards/auth.guard';
import {RoleGuard} from './components/login/guards/role.guard';
import {DetalleFacturaComponent} from './components/facturas/detalle-factura.component';
import {FacturasComponent} from './components/facturas/facturas.component';


const APP_ROUTES: Routes = [
  {path: 'home', component: ClientesComponent},
  {path: 'clientes', component: ClientesComponent},
  {path: 'clientes/page/:page', component: ClientesComponent},
  {path: 'directivas', component: DirectivaComponent},
  {path: 'clientes/form', component: FormComponent, canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_ADMIN'}},
  {path: 'clientes/form/:id', component: FormComponent, canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_ADMIN'}},
  {path: 'login', component: LoginComponent},
  {path: 'facturas/:id', component: DetalleFacturaComponent, canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_USER'}},
  {path: 'facturas/form/:clienteId', component: FacturasComponent, canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_ADMIN'}},
  {path: '', pathMatch: 'full', redirectTo: 'home'},
  {path: '**', pathMatch: 'full', redirectTo: 'home'}
];

export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES);
