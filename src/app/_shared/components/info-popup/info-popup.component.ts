import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { InfoDialogComponent } from '../info-dialog/info-dialog.component';

@Component({
  selector: 'app-info-popup',
  templateUrl: './info-popup.component.html',
  styleUrls: ['./info-popup.component.scss']
})
export class InfoPopupComponent implements OnInit {
  // Inputs
  @Input() title = '';
  @Input() text = '';
  @Input() confirm = 'Close';
  @Input() cancel = 'Cancel';

  constructor(
    private dialog: MatDialog,
    ) { }

  ngOnInit(): void {
  }

  onClick() {
    this.dialog.open(InfoDialogComponent, {
      width: '35rem',
      data: { title: this.title, text: this.text, confirm: this.confirm },
      disableClose: false
    });
  }

}
