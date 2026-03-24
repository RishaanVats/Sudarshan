import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoterAnalysis } from './voter-analysis';

describe('VoterAnalysis', () => {
  let component: VoterAnalysis;
  let fixture: ComponentFixture<VoterAnalysis>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VoterAnalysis],
    }).compileComponents();

    fixture = TestBed.createComponent(VoterAnalysis);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
