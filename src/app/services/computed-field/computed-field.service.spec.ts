import { TestBed } from '@angular/core/testing';

import { ComputedFieldService } from './computed-field.service';

describe('ComputedFieldService', () => {
  let service: ComputedFieldService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComputedFieldService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
