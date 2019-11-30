import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CekOngkirPage } from './cek-ongkir.page';

describe('CekOngkirPage', () => {
  let component: CekOngkirPage;
  let fixture: ComponentFixture<CekOngkirPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CekOngkirPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CekOngkirPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
