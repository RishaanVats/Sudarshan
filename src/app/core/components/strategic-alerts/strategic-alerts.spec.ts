import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategicAlerts } from './strategic-alerts';

describe('StrategicAlerts', () => {
  let component: StrategicAlerts;
  let fixture: ComponentFixture<StrategicAlerts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StrategicAlerts],
    }).compileComponents();

    fixture = TestBed.createComponent(StrategicAlerts);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
