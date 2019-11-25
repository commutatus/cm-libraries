import { TestBed } from '@angular/core/testing';

import { CmFilterCheckboxService } from './cm-filter-checkbox.service';

describe('CmFilterCheckboxService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CmFilterCheckboxService = TestBed.get(CmFilterCheckboxService);
    expect(service).toBeTruthy();
  });
});
