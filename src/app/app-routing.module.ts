import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// import { ThemeModule } from './theme/theme.module';


const routes: Routes = [
  {
    path: '',
    // loadChildren: () => ThemeModule,
    loadChildren: './theme/theme.module#ThemeModule'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
