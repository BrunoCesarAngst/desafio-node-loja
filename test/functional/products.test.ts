import { Product } from '@src/models/products';
import { Admin } from '@src/models/admin';
import AuthService from '@src/services/auth';

describe('Products functional testing ', () => {
  const defaultAdmin = {
    name: 'John Doe',
    email: 'john@mail.com',
    password: '1234',
  };

  let token: string;
  beforeEach(async () => {
    await Product.deleteMany({});
    await Admin.deleteMany({});
    const admin = await new Admin(defaultAdmin).save();
    token = AuthService.generateToken(admin.toJSON());
  });

  describe('When creating a product', () => {
    it('should create a product with success', async () => {
      const newProduct = {
        name: 'Product A',
        department: 'toys',
        description: 'first test product',
        price: 100.0,
        quantity: 15,
      };

      const response = await global.testRequest
        .post('/products')
        .set({ 'x-access-token': token })
        .send(newProduct);
      expect(response.status).toBe(201);
      expect(response.body).toEqual(expect.objectContaining(newProduct));
    });

    it('should return validation error when a field is invalid', async () => {
      const newProduct = {
        name: 'Product A',
        department: 'toys',
        description: 'first test product',
        price: 'NaN',
        quantity: 15,
      };
      const response = await global.testRequest
        .post('/products')
        .set({ 'x-access-token': token })
        .send(newProduct);

      //tests will be broken, not middleware
      expect(response.status).toBe(422);
      expect(response.body).toEqual({
        // code: 422,
        error:
          'Product validation failed: price: Cast to Number failed for value "NaN" at path "price"',
      });
    });

    it('should return 500 when there is any error other than validation error', async () => {
      jest
        .spyOn(Product.prototype, 'save')
        .mockImplementationOnce(() => Promise.reject('fail to create beach'));
      const newProduct = {
        name: 'Product A',
        department: 'toys',
        description: 'first test product',
        price: 100.0,
        quantity: 15,
      };

      const response = await global.testRequest
        .post('/products')
        .set({ 'x-access-token': token })
        .send(newProduct);
      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        // code: 500,
        error: 'Internal server error',
      });
    });
  });
});
