import {Injectable} from '@angular/core';
import {Cliente} from '../components/clientes/cliente';
import {Observable, throwError} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {Router} from '@angular/router';
import swall from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private urlEndPoint: string = 'http://localhost:8080/api/clientes';
  private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(private httpClient: HttpClient, private router: Router) {
  }

  getClientes(): Observable<Cliente[]> {
    // Lo podemos hacer casteando la respuesta
    // return this.httpClient.get<Cliente[]>(this.urlEndPoint);
    // return of(CLIENTES);

    // Otra opcion es usar el operador MAP
    return this.httpClient.get(this.urlEndPoint).pipe(
      map(response => response as Cliente[])
    );
  }

  getClienteById(id): Observable<Cliente> {
    return this.httpClient.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
      catchError(err => {
        this.router.navigate(['/clientes']);
        console.log(err.error.mensaje);
        return throwError(err);
      })
    );
  }

  create(cliente: Cliente): Observable<any> {
    return this.httpClient.post<any>(this.urlEndPoint, cliente, {headers: this.httpHeaders}).pipe(
      catchError(err => {
        if (err.status == 400) {
          return throwError(err);
        }
        swall.fire(
          'Error al crear cliente',
          err.error.mensaje,
          'error'
        );
        console.log(err.error.mensaje);
        return throwError(err);
      })
    );
  }

  update(cliente: Cliente): Observable<any> {
    return this.httpClient.put<any>(`${this.urlEndPoint}/${cliente.id}`, cliente, {headers: this.httpHeaders}).pipe(
      catchError(err => {
        if (err.status == 400) {
          return throwError(err);
        }
        console.log(err.error.mensaje);
        swall.fire(
          'error al actualizar cliente',
          err.error.mensaje,
          'error'
        );
        return throwError(err);
      })
    );
  }

  delete(id): Observable<Cliente> {
    return this.httpClient.delete<Cliente>(`${this.urlEndPoint}/${id}`, {headers: this.httpHeaders}).pipe(
      catchError(err => {
        console.log(err.error.mensaje);
        swall.fire(
          'error al eliminar cliente',
          err.error.mensaje,
          'error'
        );
        return throwError(err);
      })
    );
  }

}
