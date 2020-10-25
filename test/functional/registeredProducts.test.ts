describe('Product list functional testing ', () => {
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
