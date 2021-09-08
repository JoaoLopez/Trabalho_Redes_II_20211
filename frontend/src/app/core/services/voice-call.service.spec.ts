import { TestBed } from '@angular/core/testing';

import { VoiceCallService } from './voice-call.service';

describe('VoiceCallService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VoiceCallService = TestBed.get(VoiceCallService);
    expect(service).toBeTruthy();
  });
});
