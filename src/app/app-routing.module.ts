import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
    , canActivate:[AuthGuard]
  },
  {
    path: '', 
    redirectTo: '/tab/home', 
    pathMatch: 'full'
  },
  {
    path: 'producto',
    loadChildren: () => import('./pages/producto/producto.module').then( m => m.ProductoPageModule)
    , canActivate:[AuthGuard]
  },
  {
    path: 'producto/:productoId', 
    loadChildren: () => import('./pages/producto/producto.module').then(m => m.ProductoPageModule)
    , canActivate:[AuthGuard]
  },
  {
    path: 'tab',
    loadChildren: () => import('./pages/tab/tab.module').then( m => m.TabPageModule)
    , canActivate:[AuthGuard]    
  },
  {
    path: 'establecimientos',
    loadChildren: () => import('./pages/establecimientos/establecimientos.module').then( m => m.EstablecimientosPageModule)
    , canActivate:[AuthGuard]
  },
  {
    path: 'clima',
    loadChildren: () => import('./pages/clima/clima.module').then( m => m.ClimaPageModule)
    , canActivate:[AuthGuard]
  },
  {
    path: 'mi-cuenta',
    loadChildren: () => import('./pages/mi-cuenta/mi-cuenta.module').then( m => m.MiCuentaPageModule)
    , canActivate:[AuthGuard]
  },
  {
    path: 'market-place',
    loadChildren: () => import('./pages/market-place/market-place.module').then( m => m.MarketPlacePageModule)
    , canActivate:[AuthGuard]
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'crear-usuario',
    loadChildren: () => import('./pages/crear-usuario/crear-usuario.module').then( m => m.CrearUsuarioPageModule)
  },
  {
    path: 'crear-producto',
    loadChildren: () => import('./pages/crear-producto/crear-producto.module').then( m => m.CrearProductoPageModule)
    , canActivate:[AuthGuard]
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
