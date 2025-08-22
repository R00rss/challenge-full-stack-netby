import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import HttpProductRepository from './product-repository.implementation';
import ProductEntity from '../../domain/entities/product.entity';
import { ProductQuery } from '../../domain/value-objects/product-query';
import { ProductCriteria } from '../../domain/value-objects/product-criteria';
import { Pagination } from '@/app/core/domain/value-objects/pagination';
import { ApiError } from '../errors/api-errors';
import { environment } from '@/enviroments/environment';
import {
  DeleteProductsApiResponse,
  ExistsApiResponse,
  GetProductApiResponse,
  GetProductById,
  GetProductsApiResponse,
  PostProductsApiResponse,
  ProductApiDto,
  UpdateProductsApiResponse,
} from '../dto/product-api.dto';
import { ProductMapper } from '@/app/product/infrastructure/mapper/product.mapper';
import { PaginatedResult } from '@/app/core/domain/entities/paginated-result';

const dateExample1 = new Date('2023-01-01');
const dateExample2 = new Date('2024-01-01');

describe('HttpProductRepository', () => {
  let repository: HttpProductRepository;
  let httpClientSpy: jest.Mocked<HttpClient>;

  const mockProductApiDto: ProductApiDto = {
    id: '123',
    name: 'Test Product',
    description: 'Test Description',
    date_release: dateExample1.toISOString(),
    date_revision: dateExample2.toISOString(),
    logo: 'https://www.visa.com.ec/dam/VCOM/regional/lac/SPA/Default/Pay%20With%20Visa/Tarjetas/visa-signature-400x225.jpg',
  };
  const mockProductEntity: ProductEntity =
    ProductMapper.fromDto(mockProductApiDto);

  beforeEach(() => {
    const httpClientSpyObj = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        HttpProductRepository,
        { provide: HttpClient, useValue: httpClientSpyObj },
      ],
    });

    repository = TestBed.inject(HttpProductRepository);
    httpClientSpy = TestBed.inject(HttpClient) as jest.Mocked<HttpClient>;
  });

  //   describe('findById', () => {
  //     it('should return product when found', (done) => {
  //       httpClientSpy.get.mockReturnValue(of(mockProductApiDto));

  //       const id = mockProductApiDto.id;

  //       repository.findById(id).subscribe({
  //         next: (product) => {
  //           expect(product).toEqual(mockProductEntity);
  //           expect(httpClientSpy.get).toHaveBeenCalledWith(
  //             `${environment.apiUrl}/products/${id}`
  //           );
  //           done();
  //         },
  //       });
  //     });

  //     it('should return null when product not found', (done) => {
  //       httpClientSpy.get.mockReturnValue(of(null));

  //       const notValidId = '999';

  //       repository.findById(notValidId).subscribe({
  //         next: (product) => {
  //           expect(product).toBeNull();
  //           done();
  //         },
  //       });
  //     });

  //     it('should handle HTTP error', (done) => {
  //       const notValidId = '999';

  //       const errorResponse = new HttpErrorResponse({
  //         error: { name: 'NotFound', message: 'Product not found' },
  //         status: 404,
  //         statusText: 'Not Found',
  //       });
  //       httpClientSpy.get.mockReturnValue(throwError(() => errorResponse));

  //       repository.findById(notValidId).subscribe({
  //         error: (error) => {
  //           expect(error).toBeInstanceOf(ApiError);
  //           expect(error.statusCode).toBe(404);
  //           done();
  //         },
  //       });
  //     });
  //   });

  describe('findAll', () => {
    it('should return list of products', (done) => {
      const findAllApiResponse: GetProductsApiResponse = {
        data: [mockProductApiDto],
      };
      const findAllExpectedEntities = [mockProductEntity];

      httpClientSpy.get.mockReturnValue(of(findAllApiResponse));

      repository.findAll().subscribe({
        next: (products) => {
          expect(products).toEqual(findAllExpectedEntities);
          const url = `${environment.apiUrl}/products`;
          expect(httpClientSpy.get).toHaveBeenCalledWith(url);
          done();
        },
      });
    });

    it('should handle empty response', (done) => {
      const findAllEmptyResponse: GetProductsApiResponse = { data: [] };

      httpClientSpy.get.mockReturnValue(of(findAllEmptyResponse));

      repository.findAll().subscribe({
        next: (products) => {
          expect(products).toEqual(findAllEmptyResponse.data);
          done();
        },
      });
    });

    it('should handle HTTP error', (done) => {
      const errorResponse = new HttpErrorResponse({
        error: { name: 'ServerError', message: 'Internal server error' },
        status: 500,
        statusText: 'Internal Server Error',
      });

      httpClientSpy.get.mockReturnValue(throwError(() => errorResponse));

      repository.findAll().subscribe({
        error: (error) => {
          expect(error).toBeInstanceOf(ApiError);
          expect(error.statusCode).toBe(500);
          done();
        },
      });
    });
  });

  describe('create', () => {
    const postProductsApiResponse: PostProductsApiResponse = {
      message: 'Product created successfully',
      data: mockProductApiDto,
    };

    it('should create product successfully', (done) => {
      httpClientSpy.post.mockReturnValue(of(postProductsApiResponse));

      repository.create(mockProductEntity).subscribe({
        next: (result) => {
          expect(result.data).toEqual(mockProductEntity);
          expect(result.message).toBe(postProductsApiResponse.message);
          const url = `${environment.apiUrl}/products`;
          expect(httpClientSpy.post).toHaveBeenCalledWith(
            url,
            mockProductApiDto
          );
          done();
        },
      });
    });

    it('should handle validation errors', (done) => {
      const errorResponse = new HttpErrorResponse({
        error: { name: 'ValidationError', message: 'Invalid product data' },
        status: 400,
        statusText: 'Bad Request',
      });

      httpClientSpy.post.mockReturnValue(throwError(() => errorResponse));

      repository.create(mockProductEntity).subscribe({
        error: (error) => {
          expect(error).toBeInstanceOf(ApiError);
          expect(error.statusCode).toBe(400);
          done();
        },
      });
    });
  });

  describe('createWithValidation', () => {
    it('should create product when it does not exist', (done) => {
      const mockCreateResponse = {
        data: mockProductApiDto,
        message: 'Product created successfully',
      };

      const id = mockProductEntity.id;

      httpClientSpy.get.mockReturnValue(of(false)); // exists check
      httpClientSpy.post.mockReturnValue(of(mockCreateResponse)); // create

      repository.createWithValidation(mockProductEntity).subscribe({
        next: (result) => {
          expect(result.data).toEqual(mockProductEntity);

          const urlCheck = `${environment.apiUrl}/products/verification/${id}`;
          const urlCreate = `${environment.apiUrl}/products`;

          expect(httpClientSpy.get).toHaveBeenCalledWith(urlCheck);
          expect(httpClientSpy.post).toHaveBeenCalledWith(
            urlCreate,
            mockProductApiDto
          );
          done();
        },
      });
    });

    it('should throw error when product already exists', (done) => {
      httpClientSpy.get.mockReturnValue(of(true)); // exists check
      const message = 'Entity with this ID already exists';
      const id = mockProductEntity.id;

      repository.createWithValidation(mockProductEntity).subscribe({
        error: (error) => {
          expect(error.message).toBe(message);
          const urlCheck = `${environment.apiUrl}/products/verification/${id}`;
          expect(httpClientSpy.get).toHaveBeenCalledWith(urlCheck);
          expect(httpClientSpy.post).not.toHaveBeenCalled();
          done();
        },
      });
    });
  });

  describe('exists', () => {
    it('should return true when product exists', (done) => {
      httpClientSpy.get.mockReturnValue(of(true));
      const id = '1';

      repository.exists(id).subscribe({
        next: (exists) => {
          expect(exists).toBe(true);
          const url = `${environment.apiUrl}/products/verification/${id}`;
          expect(httpClientSpy.get).toHaveBeenCalledWith(url);
          done();
        },
      });
    });

    it('should return false when product does not exist', (done) => {
      httpClientSpy.get.mockReturnValue(of(false));

      const id = '999';

      repository.exists(id).subscribe({
        next: (exists) => {
          expect(exists).toBe(false);
          done();
        },
      });
    });
  });

  describe('delete', () => {
    it('should delete product successfully', (done) => {
      const deleteProductsApiResponse: DeleteProductsApiResponse = {
        message: 'Product deleted successfully',
      };

      httpClientSpy.delete.mockReturnValue(of(deleteProductsApiResponse));

      const id = '1';

      repository.delete(id).subscribe({
        next: (result) => {
          expect(result).toBeUndefined();
          const url = `${environment.apiUrl}/products/${id}`;
          expect(httpClientSpy.delete).toHaveBeenCalledWith(url);
          done();
        },
      });
    });

    it('should handle delete errors', (done) => {
      const errorResponse = new HttpErrorResponse({
        error: { name: 'NotFound', message: 'Product not found' },
        status: 404,
        statusText: 'Not Found',
      });

      const id = '999';

      httpClientSpy.delete.mockReturnValue(throwError(() => errorResponse));

      repository.delete(id).subscribe({
        error: (error) => {
          expect(error).toBeInstanceOf(ApiError);
          expect(error.statusCode).toBe(404);
          done();
        },
      });
    });
  });

  describe('update', () => {
    const updateProductsApiResponse: UpdateProductsApiResponse = {
      message: 'Updated Product',
      data: mockProductApiDto,
    };

    it('should update product successfully', (done) => {
      httpClientSpy.put.mockReturnValue(of(updateProductsApiResponse));

      const id = mockProductEntity.id;

      repository.update(id, mockProductEntity).subscribe({
        next: (product) => {
          expect(product.dateRelease).toStrictEqual(
            mockProductEntity.dateRelease
          );
          expect(product.dateReview).toStrictEqual(
            mockProductEntity.dateReview
          );

          const url = `${environment.apiUrl}/products/${id}`;
          expect(httpClientSpy.put).toHaveBeenCalledWith(
            url,
            mockProductApiDto
            // expect.any(Object)
          );
          done();
        },
      });
    });

    it('should handle update errors', (done) => {
      const errorResponse = new HttpErrorResponse({
        error: { name: 'ValidationError', message: 'Invalid update data' },
        status: 400,
        statusText: 'Bad Request',
      });

      httpClientSpy.put.mockReturnValue(throwError(() => errorResponse));

      const id = mockProductEntity.id;

      repository.update(id, mockProductEntity).subscribe({
        error: (error) => {
          expect(error).toBeInstanceOf(ApiError);
          expect(error.statusCode).toBe(400);
          done();
        },
      });
    });
  });

  describe('findByQuery', () => {
    const getProductsApiResponse: GetProductsApiResponse = {
      data: [mockProductApiDto],
    };

    it('should return paginated results', (done) => {
      const page = 1;
      const pageSize = 10;
      const searchTerm = '123';
      const criteria = new ProductCriteria(searchTerm);
      const pagination = new Pagination(page, pageSize);
      const productQuery = new ProductQuery(criteria, pagination);

      httpClientSpy.get.mockReturnValue(of(getProductsApiResponse));
      repository.findByQuery(productQuery).subscribe({
        next: (result) => {
          expect(result.items).toEqual([mockProductEntity]);
          expect(result.totalItems).toBe(getProductsApiResponse.data.length);
          expect(result.pagination.page).toBe(page);
          expect(result.pagination.pageSize).toBe(pageSize);
          done();
        },
      });
    });

    it('should filter products based on criteria', (done) => {
      const getProductsApiResponse: GetProductsApiResponse = {
        data: [
          mockProductApiDto,
          { ...mockProductApiDto, id: '1234', name: 'Another Product' },
        ],
      };

      httpClientSpy.get.mockReturnValue(of(getProductsApiResponse));

      const productQuery = new ProductQuery(new ProductCriteria('1234'));

      repository.findByQuery(productQuery).subscribe({
        next: (result) => {
          expect(result.items).toHaveLength(1);
          expect(result.items[0].id).toStrictEqual('1234');
          expect(result.totalItems).toBe(1);
          done();
        },
      });
    });
  });
});
