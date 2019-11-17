import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PilihAlamatPage } from './pilih-alamat.page';

describe('PilihAlamatPage', () => {
  let component: PilihAlamatPage;
  let fixture: ComponentFixture<PilihAlamatPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PilihAlamatPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PilihAlamatPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
