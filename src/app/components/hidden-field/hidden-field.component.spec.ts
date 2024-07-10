import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {HiddenFieldComponent} from './hidden-field.component';

describe('HiddenFieldComponent', () => {
  let component: HiddenFieldComponent;
  let fixture: ComponentFixture<HiddenFieldComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [HiddenFieldComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HiddenFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
