import {Component, OnInit} from '@angular/core';
import {Usuario} from './usuario';
import swall from 'sweetalert2';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  titulo: string = 'Por favor incie sesion';
  usuario: Usuario;

  constructor(private authService: AuthService, private router: Router) {
    this.usuario = new Usuario();
  }

  ngOnInit() {
    if (this.authService.isAuthenticated()) {
      swall.fire('Login', `Hola ${this.authService.usuario.username} ya estas autenticado`, 'info');
      this.router.navigate(['/clientes']);
    }
  }

  login(): void {
    console.log(this.usuario);
    if (this.usuario.username == null || this.usuario.password == null) {
      swall.fire(
        'Campos obligatorios sin completar',
        'Por favor ingrese usuario y contraseña',
        'error'
      );
    }

    console.log('logueando: antes del service');

    this.authService.login(this.usuario).subscribe(response => {
      console.log(response);

      this.authService.guardarUsuario(response.access_token);
      this.authService.guardarToken(response.access_token);

      let usuario = this.authService.usuario;

      this.router.navigate(['/clientes']);
      swall.fire('Login', `Hola ${usuario.username}, has iniciado sesion con exito`, 'success');
    }, error => {
      if (error.status == 400) {
        swall.fire('Error de login', 'Usuario o clave incorrecta', 'error');
      }
    });
  }

}
