/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { DatoSaludComponent } from './dato-salud.component';

describe('DatoSaludComponent', () => {
  let component: DatoSaludComponent;
  let fixture: ComponentFixture<DatoSaludComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatoSaludComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatoSaludComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
