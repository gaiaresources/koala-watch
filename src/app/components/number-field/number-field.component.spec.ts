import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {NumberFieldComponent} from './number-field.component';

describe('NumberFieldComponent', () => {
  let component: NumberFieldComponent;
  let fixture: ComponentFixture<NumberFieldComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [NumberFieldComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NumberFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
