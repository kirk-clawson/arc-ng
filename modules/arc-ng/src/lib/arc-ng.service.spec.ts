import { TestBed } from '@angular/core/testing';

import { ArcNgService } from './arc-ng.service';

describe('ArcNgService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ArcNgService = TestBed.get(ArcNgService);
    expect(service).toBeTruthy();
  });
});
