import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeatherPlanner } from './weather-planner';

describe('WeatherPlanner', () => {
  let component: WeatherPlanner;
  let fixture: ComponentFixture<WeatherPlanner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeatherPlanner],
    }).compileComponents();

    fixture = TestBed.createComponent(WeatherPlanner);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
