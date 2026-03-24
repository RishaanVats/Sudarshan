import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarRoomReports } from './war-room-reports';

describe('WarRoomReports', () => {
  let component: WarRoomReports;
  let fixture: ComponentFixture<WarRoomReports>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WarRoomReports],
    }).compileComponents();

    fixture = TestBed.createComponent(WarRoomReports);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
