import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { completeGuardGuard } from './complete-guard.guard';

describe('completeGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => completeGuardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
