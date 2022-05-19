import { HistoryRoutingModule } from './history-routing.module';
import { SharedModule } from './../../_shared/modules/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HistoryComponent } from './history.component';



@NgModule({
  declarations: [
    HistoryComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    HistoryRoutingModule
  ]
})
export class HistoryModule { }
