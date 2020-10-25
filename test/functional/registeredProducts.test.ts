import { Product } from "@src/models/products";

describe('Product list functional testing ', () => {
  beforeEach(async () => {
    await Product.deleteMany({});
    const defaultProduct: Product = {
      name: 'Product A',
      description: 'first test product',
      price: 100.0,
    };
    const product = new Product(defaultProduct);
    await product.save();
  });

  it('should return a list of products', async () => {
    const { body, status } = await global.testRequest.get('/products');
    expect(status).toBe(200);
    expect(body).toEqual([
      {
        name: 'Product A',
        description: 'first test product',
        price: 100.0,
      },
      {
        name: 'Product B',
        description: 'secund test product',
        price: 200.0,
      },
    ]);
  });
});
