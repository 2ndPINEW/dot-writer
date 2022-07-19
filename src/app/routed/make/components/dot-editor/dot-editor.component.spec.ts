import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DotEditorComponent } from './dot-editor.component';

describe('DotEditorComponent', () => {
  let component: DotEditorComponent;
  let fixture: ComponentFixture<DotEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DotEditorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DotEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
