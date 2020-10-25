import { Department, Product } from "@src/models/products";
// import nock from "nock";

describe('Product list functional testing ', () => {
  beforeEach(async () => {
    await Product.deleteMany({});
    const defaultProduct: Product = {
      name: 'Product A',
      department: Department.TOYS,
      description: 'first test product',
      price: 100.0,
      quantity: 15,
    };
    const product = new Product(defaultProduct);
    await product.save();
  });

  it('should return a list of products', async () => {
    // nock.recorder.rec();
    const { body, status } = await global.testRequest.get('/products');
    expect(status).toBe(200);
    expect(body).toEqual([
      {
        name: 'Product A',
        department: 'toys',
        description: 'first test product',
        price: 100.0,
        quantity: 15,
      }
    ]);
  });
});
