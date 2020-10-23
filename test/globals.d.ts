declare namespace NodeJS {
  interface Global {
    // instruções https://stackoverflow.com/a/51114250
    testRequest: import('supertest').SuperTest<import('supertest').Test>;
  }
}
