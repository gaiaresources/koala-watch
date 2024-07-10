import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {RecordPhotosComponent} from './record-photos.component';

describe('RecordPhotosComponent', () => {
  let component: RecordPhotosComponent;
  let fixture: ComponentFixture<RecordPhotosComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [RecordPhotosComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RecordPhotosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
