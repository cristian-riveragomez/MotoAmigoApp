import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabPage } from './tab.page';
import { AuthGuard } from '../../guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: TabPage,
    children: [
      {
        path:'clima',
        loadChildren: () => import('../clima/clima.module').then(m => m.ClimaPageModule), 
        canActivate:[AuthGuard],
        runGuardsAndResolvers: 'always'
      },
      {
        path:'establecimientos',
        loadChildren: () => import('../establecimientos/establecimientos.module').then(m => m.EstablecimientosPageModule)
        , canActivate:[AuthGuard]
        ,runGuardsAndResolvers: 'always'
      },
      {
        path:'market-place',
        loadChildren: () => import('../market-place/market-place.module').then(m => m.MarketPlacePageModule)
        , canActivate:[AuthGuard]
        ,runGuardsAndResolvers: 'always'
      },
      {
        path:'mi-cuenta',
        loadChildren: () => import('../mi-cuenta/mi-cuenta.module').then(m => m.MiCuentaPageModule)
        , canActivate:[AuthGuard]
        ,runGuardsAndResolvers: 'always'
      },
      {
        path: 'crear-producto/:id',
        loadChildren: () => import('../crear-producto/crear-producto.module').then(m => m.CrearProductoPageModule)
        , canActivate:[AuthGuard]
        ,runGuardsAndResolvers: 'always'
      },
      {
        path: 'producto/:productoId/:tipo', // Ruta para los detalles del producto con un parámetro 'productId'
        loadChildren: () => import('../producto/producto.module').then(m => m.ProductoPageModule)
        , canActivate:[AuthGuard]
      },
      {
        path: 'home',
        loadChildren: () => import('../../home/home.module').then(m => m.HomePageModule)
        , canActivate:[AuthGuard]
      },
      {
        path: '', 
        redirectTo: '/tab/home',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabPageRoutingModule {}
