import { TestBed } from '@angular/core/testing';

import { ActivePhotoService } from './active-photo.service';

describe('ActivePhotoService', () => {
  let service: ActivePhotoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ActivePhotoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
