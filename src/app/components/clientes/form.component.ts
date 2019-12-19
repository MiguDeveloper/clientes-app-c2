import {Component, OnInit} from '@angular/core';
import {Cliente} from './cliente';
import {ClienteService} from '../../services/cliente.service';
import {ActivatedRoute, Router} from '@angular/router';
import swall from 'sweetalert2';
import {Region} from './Region';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {

  public cliente: Cliente = new Cliente();
  private titulo: string = 'Registrar Cliente';
  private errores: string[];
  private regiones: Region[];

  constructor(private clienteService: ClienteService,
              private router: Router,
              private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.getCliente();
    this.clienteService.getRegiones().subscribe(regiones => this.regiones = regiones);
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
          `${json.mensaje}: ${json.cliente.nombre} creado con éxito`,
          'success'
        );
      },// el segundo parametro del subscrube es el ERROR
      err => {
        this.errores = err.error.errors as string[];
        console.log('Codigo de error desde backend: ' + err.status);
        console.log(err.error.errors);
      }
    );
  }

  update(): void {
    console.log(this.cliente);
    // Para evitar el problema de la recursion en las relaciones del backend  seteamos a null las facturas ya que estamos
    // actualizando el cliente y no sus facturas
    this.cliente.facturas = null;
    this.clienteService.update(this.cliente).subscribe(json => {
        this.router.navigate(['/clientes']);
        swall.fire(
          'Cliente actualizado',
          `${json.mensaje}: ${json.cliente.nombre}`,
          'success'
        );
      },
      err => {
        this.errores = err.error.errors as string[];
        console.log('Codigo de error desde el backend: ' + err.status);
        console.log(err.error.errors);
      }
    );
  }

  compararRegion(o1: Region, o2: Region): boolean {
    if (o1 === undefined && o2 === undefined) {
      return true;
    }
    return o1 === null || o2 === null || o1 === undefined || o2 === undefined ? false : o1.id === o2.id;
  }
}
