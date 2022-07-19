import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  templateUrl: './index.component.html',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class IndexComponent {
}
