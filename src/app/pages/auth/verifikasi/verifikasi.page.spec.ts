import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerifikasiPage } from './verifikasi.page';

describe('VerifikasiPage', () => {
  let component: VerifikasiPage;
  let fixture: ComponentFixture<VerifikasiPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerifikasiPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerifikasiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
