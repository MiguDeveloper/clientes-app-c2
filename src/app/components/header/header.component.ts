import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import swall from 'sweetalert2';
import {Router} from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  titulo: string = 'Miguel APP';

  constructor(private authService: AuthService, private router: Router) {
  }

  ngOnInit() {
  }

  logout(): void {
    let username = this.authService.usuario.username;

    this.authService.logout();
    swall.fire('Logout', `Hola ${username} has cerrado sesion con éxito`, 'success');
    this.router.navigate(['/login']);
  }

}
