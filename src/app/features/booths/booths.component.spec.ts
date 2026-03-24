import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoothsComponent } from './booths.component';

describe('BoothsComponent', () => {
  let component: BoothsComponent;
  let fixture: ComponentFixture<BoothsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoothsComponent
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BoothsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
