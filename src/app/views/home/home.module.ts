import { HomeRoutingModule } from './home-routing.module';
import { SharedModule } from './../../_shared/modules/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { UploadOfflineComponent } from './upload-offline/upload-offline.component';



@NgModule({
  declarations: [
    HomeComponent,
    UploadOfflineComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    HomeRoutingModule
  ]
})
export class HomeModule { }
