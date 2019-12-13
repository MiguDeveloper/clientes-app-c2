import {Component, OnInit} from '@angular/core';
import {Cliente} from './cliente';
import {ClienteService} from '../../services/cliente.service';
import swall from 'sweetalert2';
import {ActivatedRoute} from '@angular/router';
import {ModalService} from '../../services/detalle/modal.service';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html'
})
export class ClientesComponent implements OnInit {

  clientes: Cliente[];
  paginador: any;
  clienteSeleccionado: Cliente;

  constructor(private clienteService: ClienteService,
              private activatedRoute: ActivatedRoute,
              private modalService: ModalService,
              private authService: AuthService) {
  }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      let page: number = +params.get('page');
      if (!page) {
        page = 0;
      }
      this.clienteService.getClientes(page).subscribe(
        response => {
          this.clientes = response.content as Cliente[];
          this.paginador = response;
        }
      );
    });
    this.modalService.notificarUpload.subscribe(cliente => {
      this.clientes = this.clientes.map(clienteOriginal => {
        if (cliente.id == clienteOriginal.id) {
          clienteOriginal.foto = cliente.foto;
        }
        return clienteOriginal;
      });
    });
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

  abrirModal(cliente: Cliente) {
    this.modalService.abrirModal();
    this.clienteSeleccionado = cliente;
  }
}
