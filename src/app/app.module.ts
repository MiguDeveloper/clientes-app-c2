import {BrowserModule} from '@angular/platform-browser';
import {LOCALE_ID, NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {HeaderComponent} from './components/header/header.component';
import {FooterComponent} from './components/footer/footer.component';
import {DirectivaComponent} from './components/directiva/directiva.component';
import {ClientesComponent} from './components/clientes/clientes.component';
import {ClienteService} from './services/cliente.service';
import {APP_ROUTING} from './app.routes';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {FormComponent} from './components/clientes/form.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {registerLocaleData} from '@angular/common';
import localeES from '@angular/common/locales/es';
import {PaginatorComponent} from './components/paginator/paginator.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatAutocompleteModule, MatDatepickerModule, MatInputModule} from '@angular/material';
import {MatMomentDateModule} from '@angular/material-moment-adapter';
import {DetalleComponent} from './components/clientes/detalle/detalle.component';
import {LoginComponent} from './components/login/login.component';
import {TokenInterceptor} from './components/login/interceptors/token.interceptor';
import {AuthInterceptor} from './components/login/interceptors/auth.interceptor';
import {DetalleFacturaComponent} from './components/facturas/detalle-factura.component';
import { FacturasComponent } from './components/facturas/facturas.component';

registerLocaleData(localeES, 'es');

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    DirectivaComponent,
    ClientesComponent,
    FormComponent,
    PaginatorComponent,
    DetalleComponent,
    LoginComponent,
    DetalleFacturaComponent,
    FacturasComponent
  ],
  imports: [
    APP_ROUTING,
    HttpClientModule,
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatMomentDateModule,
    ReactiveFormsModule,// autocomplete
    MatAutocompleteModule, // autocomplete
    MatInputModule //autocomplete
  ],
  providers: [
    ClienteService,
    {provide: LOCALE_ID, useValue: 'es'},
    {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
