import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadBuktiPage } from './upload-bukti.page';

describe('UploadBuktiPage', () => {
  let component: UploadBuktiPage;
  let fixture: ComponentFixture<UploadBuktiPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadBuktiPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadBuktiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
