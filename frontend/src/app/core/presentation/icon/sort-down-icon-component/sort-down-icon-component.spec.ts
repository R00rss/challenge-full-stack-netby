import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SortDownIconComponent } from './sort-down-icon-component';

describe('SortDownIconComponent', () => {
  let component: SortDownIconComponent;
  let fixture: ComponentFixture<SortDownIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SortDownIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SortDownIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
