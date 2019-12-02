import {Component, OnInit} from '@angular/core';
import {Cliente} from './cliente';
import {ClienteService} from '../../services/cliente.service';
import swall from 'sweetalert2';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html'
})
export class ClientesComponent implements OnInit {

  clientes: Cliente[];

  constructor(private clienteService: ClienteService) {
  }

  ngOnInit() {
    this.clienteService.getClientes().subscribe(
      clientes => this.clientes = clientes
    );
  }

  delete(cliente: Cliente): void {
    swall.fire({
      title: 'Estas seguro?',
      text: `seguro que desea elminar al cliente ${cliente.nombre}`,
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.value) {
        this.clienteService.delete(cliente.id).subscribe(response => {
          this.clientes = this.clientes.filter(cli => cli != cliente);
          swall.fire(
            'Eliminado',
            'Cliente eliminado con exito',
            'success'
          );
        });
      }
    });

  }


}
