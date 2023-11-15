import { Injectable } from '@angular/core';
import { Usuario } from './connection.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  idUsuario!: string;
  
  private isAuthenticatedObservers: ((status: boolean) => void)[] = [];
  public isAuthenticated: (status: boolean) => void = (status: boolean) => {
    this.isAuthenticatedObservers.forEach(observer => observer(status));
  };

  private esAdminObservers: ((status: boolean) => void)[] = [];
  public esAdmin: (status: boolean) => void = (status: boolean) => {
    this.esAdminObservers.forEach(observer => observer(status));
  };

  constructor() {
    this.GetIdUsuarioLocalStorage();
  }

  private setAuthenticationStatus(status: boolean) {
    this.isAuthenticated(status);
  }

  private setAdminStatus(status: boolean) {
    this.esAdmin(status);
  }

  guardarIdEnLocalStorage(idUsuario: string) {
    this.idUsuario = idUsuario;
    localStorage.setItem('idUsuario', idUsuario);
    this.setAuthenticationStatus(true);
  }

  GetIdUsuarioLocalStorage(): string {
    if (localStorage.getItem('idUsuario')) {
      this.idUsuario = localStorage.getItem('idUsuario')!;
      this.setAuthenticationStatus(true);
    } else {
      this.idUsuario = '';
    }

    return this.idUsuario;
  }

  esUnUsuarioAutenticado(): boolean {
    let autenticado = true;

    if (this.GetIdUsuarioLocalStorage() === '') {
      autenticado = false;
    }

    return autenticado;
  }

  logout() {
    localStorage.removeItem('idUsuario');
    this.setAuthenticationStatus(false);
  }

  validarSiEsAdmin(usuario: Usuario) {
    if (usuario.esAdmin) {
      this.setAdminStatus(true);
    } else {
      this.setAdminStatus(false);
    }
  }

  // Métodos adicionales para permitir la suscripción a cambios
  subscribeToAuthenticationStatus(observer: (status: boolean) => void) {
    this.isAuthenticatedObservers.push(observer);
  }

  subscribeToAdminStatus(observer: (status: boolean) => void) {
    this.esAdminObservers.push(observer);
  }
}
