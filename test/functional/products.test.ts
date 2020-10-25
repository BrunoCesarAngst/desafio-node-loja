import { Product } from '@src/models/products';

describe('Products functional testing ', () => {
  beforeEach(async () => {
    await Product.deleteMany({});
  });
  describe('When creating a product', () => {
    it('should create a product with success', async () => {
      const newProduct = {
        name: 'Product A',
        description: 'first test product',
        price: 100.0,
      };

      const response = await global.testRequest
        .post('/products')
        .send(newProduct);
      expect(response.status).toBe(201);
      expect(response.body).toEqual(expect.objectContaining(newProduct));
    });

    it('should return validation error when a field is invalid', async () => {
      const newProduct = {
        name: 'Product A',
        description: 'first test product',
        price: 'invalid_string',
      };
      const response = await global.testRequest
        .post('/products')
        .send(newProduct);

      //tests will be broken, not middleware
      expect(response.status).toBe(422);
      expect(response.body).toEqual({
        error:
        'Product validation failed: price: Cast to Number failed for value "invalid_string" at path "price"',
      });
    });

    it('should return 500 when there is any error other than validation error', async () => {
      jest
        .spyOn(Product.prototype, 'save')
        .mockImplementationOnce(() => Promise.reject('fail to create beach'));
        const newProduct = {
          name: 'Product A',
          description: 'first test product',
          price: 100.0,
        };

      const response = await global.testRequest
        .post('/products')
        .send(newProduct)
      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        error: 'Internal server error',
      });
    });
  });
});
