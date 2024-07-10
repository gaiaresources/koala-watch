import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ObservationPhotosPage } from './observation-photos.page';

describe('ObservationPhotosPage', () => {
  let component: ObservationPhotosPage;
  let fixture: ComponentFixture<ObservationPhotosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ObservationPhotosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
