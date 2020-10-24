describe('Product list functional testing ', () => {
  it('should return a list of products', async () => {
    const { body, status } = await global.testRequest.get('/products');
    expect(status).toBe(200);
    expect(body).toEqual([
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
