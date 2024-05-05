import { TestBed } from '@angular/core/testing';

import { SpFormService } from './sp-form.service';

describe('SpFormService', () => {
  let service: SpFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
