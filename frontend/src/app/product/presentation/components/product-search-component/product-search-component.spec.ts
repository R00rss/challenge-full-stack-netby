import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductSearchComponent } from './product-search-component';
import { ProductService } from '@/app/product/application/services/product-service';

describe('ProductSearchComponent', () => {
  let component: ProductSearchComponent;
  let fixture: ComponentFixture<ProductSearchComponent>;
  let mockProductService: jest.Mocked<ProductService>;

  beforeEach(async () => {
    mockProductService = {
      changeFilter: jest.fn(),
    } as any;

    await TestBed.configureTestingModule({
      imports: [ProductSearchComponent],
      providers: [{ provide: ProductService, useValue: mockProductService }],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductSearchComponent);
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
