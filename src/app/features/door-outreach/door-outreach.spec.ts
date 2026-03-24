import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoorOutreach } from './door-outreach';

describe('DoorOutreach', () => {
  let component: DoorOutreach;
  let fixture: ComponentFixture<DoorOutreach>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoorOutreach],
    }).compileComponents();

    fixture = TestBed.createComponent(DoorOutreach);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
