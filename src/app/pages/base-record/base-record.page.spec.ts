import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BaseRecordPage } from './base-record.page';

describe('BaseRecordPage', () => {
  let component: BaseRecordPage;
  let fixture: ComponentFixture<BaseRecordPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BaseRecordPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
