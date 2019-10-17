import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { TransaksiPage } from './transaksi.page';

describe('TransaksiPage', () => {
  let component: TransaksiPage;
  let fixture: ComponentFixture<TransaksiPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TransaksiPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(TransaksiPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
