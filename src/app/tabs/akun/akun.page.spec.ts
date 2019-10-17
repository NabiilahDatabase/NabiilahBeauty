import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AkunPage } from './akun.page';

describe('AkunPage', () => {
  let component: AkunPage;
  let fixture: ComponentFixture<AkunPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AkunPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AkunPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
