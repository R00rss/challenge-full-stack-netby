import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TransactionSearchComponent } from './transaction-search-component';
import { TransactionService } from '@/app/transaction/application/services/transaction-service';

describe('TransactionSearchComponent', () => {
  let component: TransactionSearchComponent;
  let fixture: ComponentFixture<TransactionSearchComponent>;
  let mockTransactionService: jest.Mocked<TransactionService>;

  beforeEach(async () => {
    mockTransactionService = {
      changeFilter: jest.fn(),
    } as any;

    await TestBed.configureTestingModule({
      imports: [TransactionSearchComponent],
      providers: [
        { provide: TransactionService, useValue: mockTransactionService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render search input', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const input = compiled.querySelector('input[type="text"]');

    expect(input).toBeTruthy();
    expect(input?.getAttribute('placeholder')).toBe('Search...');
  });

  it('should initialize searchTerm$ Subject', () => {
    expect(component.searchTerm$).toBeTruthy();
  });

  it('should call next on searchTerm$ when onSearchTermChange is called', () => {
    const nextSpy = jest.spyOn(component.searchTerm$, 'next');
    const testValue = 'test search';
    const mockEvent = { target: { value: testValue } };

    component.onSearchTermChange(mockEvent);

    expect(nextSpy).toHaveBeenCalledWith(testValue);
  });
});
