import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecordsListPage } from './records-list.page';

describe('RecordsListPage', () => {
  let component: RecordsListPage;
  let fixture: ComponentFixture<RecordsListPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordsListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
