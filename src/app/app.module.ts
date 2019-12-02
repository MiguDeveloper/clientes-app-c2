import {BrowserModule} from '@angular/platform-browser';
import {LOCALE_ID, NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {HeaderComponent} from './components/header/header.component';
import {FooterComponent} from './components/footer/footer.component';
import {DirectivaComponent} from './components/directiva/directiva.component';
import {ClientesComponent} from './components/clientes/clientes.component';
import {ClienteService} from './services/cliente.service';
import {APP_ROUTING} from './app.routes';
import {HttpClientModule} from '@angular/common/http';
import {FormComponent} from './components/clientes/form.component';
import {FormsModule} from '@angular/forms';
import {registerLocaleData} from '@angular/common';
import localeES from '@angular/common/locales/es';

registerLocaleData(localeES, 'es');

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    DirectivaComponent,
    ClientesComponent,
    FormComponent
  ],
  imports: [
    APP_ROUTING,
    HttpClientModule,
    BrowserModule,
    FormsModule
  ],
  providers: [
    ClienteService,
    {provide: LOCALE_ID, useValue: 'es'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
