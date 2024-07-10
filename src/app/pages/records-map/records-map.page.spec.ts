import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecordsMapPage } from './records-map.page';

describe('RecordsMapPage', () => {
  let component: RecordsMapPage;
  let fixture: ComponentFixture<RecordsMapPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordsMapPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
