import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfluencerNetwork } from './influencer-network';

describe('InfluencerNetwork', () => {
  let component: InfluencerNetwork;
  let fixture: ComponentFixture<InfluencerNetwork>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfluencerNetwork],
    }).compileComponents();

    fixture = TestBed.createComponent(InfluencerNetwork);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
