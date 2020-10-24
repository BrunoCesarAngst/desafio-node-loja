import { ProductController } from '@src/controllers/Product';

describe('Product list functional testing ', () => {
  it('should return a list of products', async () => {
    const products = new ProductController;
    expect(products).toBe([
      {
        code: '1',
        name: 'Product A',
        description: 'first test product',
        price: 100.0,
        images: [
          {
            code: '111',
            file: 'string',
          },
          {
            code: '111',
            file: 'string',
          },
        ],
      },
      {
        code: '2',
        name: 'Product B',
        description: 'secund test product',
        price: 200.0,
        images: [
          {
            code: '222',
            file: 'string',
          },
          {
            code: '222',
            file: 'string',
          },
        ],
      },
    ]);
  });
});
