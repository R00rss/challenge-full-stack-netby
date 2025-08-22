import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SortUpIconComponent } from './sort-up-icon-component';

describe('SortUpIconComponent', () => {
  let component: SortUpIconComponent;
  let fixture: ComponentFixture<SortUpIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SortUpIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SortUpIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
