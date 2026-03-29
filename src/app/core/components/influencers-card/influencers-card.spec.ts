import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfluencersCard } from './influencers-card';

describe('InfluencersCard', () => {
  let component: InfluencersCard;
  let fixture: ComponentFixture<InfluencersCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfluencersCard],
    }).compileComponents();

    fixture = TestBed.createComponent(InfluencersCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
