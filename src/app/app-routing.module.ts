import { MainComponent } from './main/main.component';
import { SplashComponent } from './views/splash/splash.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './views/not-found/not-found.component';

const routes: Routes = [
  { path: '', component: SplashComponent },
  { path: 'app', component: MainComponent, children: [
    { path: 'home', loadChildren: () => import('src/app/views/home/home.module').then(m => m.HomeModule) },
    { path: 'observation', loadChildren: () => import('src/app/views/observation/observation.module').then(m => m.ObservationModule) },
    { path: 'history', loadChildren: () => import('src/app/views/history/history.module').then(m => m.HistoryModule) },
  ] },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
