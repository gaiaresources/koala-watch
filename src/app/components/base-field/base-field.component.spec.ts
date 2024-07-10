import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {BaseFieldComponent} from './base-field.component';

describe('BaseFieldComponent', () => {
  let component: BaseFieldComponent;
  let fixture: ComponentFixture<BaseFieldComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [BaseFieldComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BaseFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
