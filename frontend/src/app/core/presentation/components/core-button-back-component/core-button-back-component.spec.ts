import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoreButtonBackComponent } from './core-button-back-component';

describe('CoreButtonBackComponent', () => {
  let component: CoreButtonBackComponent;
  let fixture: ComponentFixture<CoreButtonBackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoreButtonBackComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoreButtonBackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
