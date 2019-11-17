import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditAlamatPage } from './edit-alamat.page';

describe('EditAlamatPage', () => {
  let component: EditAlamatPage;
  let fixture: ComponentFixture<EditAlamatPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditAlamatPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditAlamatPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
