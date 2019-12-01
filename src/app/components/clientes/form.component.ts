import {Component, OnInit} from '@angular/core';
import {Cliente} from './cliente';
import {ClienteService} from '../../services/cliente.service';
import {ActivatedRoute, Router} from '@angular/router';
import swall from 'sweetalert2';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

  private cliente: Cliente = new Cliente();
  private titulo: string = 'Registrar Cliente';
  private errores: string[];

  constructor(private clienteService: ClienteService,
              private router: Router,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.getCliente();
  }

  getCliente(): void {
    this.activatedRoute.params.subscribe(params => {
      let id = params['id'];
      if (id) {
        this.clienteService.getClienteById(id).subscribe(
          cliente => this.cliente = cliente
        );
      }
    });
  }

  create(): void {
    this.clienteService.create(this.cliente).subscribe(
      json => {
        this.router.navigate(['/clientes']);
        swall.fire(
          'Nuevo Cliente',
          `${json.mensaje}: ${json.cliente.nombre} `,
          'success'
        );
      },
      err => {
        this.errores = err.error.errors as string[];
        console.log('Codigo de error desde backend: ' + err.status);
        console.log(err.error.errors);
      }
    );
  }
}
