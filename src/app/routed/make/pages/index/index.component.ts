import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DotEditorComponent } from '../../components/dot-editor/dot-editor.component';

@Component({
  templateUrl: './index.component.html',
  standalone: true,
  styleUrls: ['index.component.scss'],
  imports: [
    CommonModule,
    RouterModule,
    DotEditorComponent
  ]
})
export class IndexComponent implements OnInit{
  constructor (
  ) {}


  ngOnInit (): void {
  }
}
