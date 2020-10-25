import './util/module-alias';
import { Server } from '@overnightjs/core';
import { Application } from 'express';
import bodyParser from 'body-parser';
import { ProductController } from './controllers/product';
import { UsersController } from './controllers/users';
import * as database from '@src/database';

export class SetupServer extends Server {
  /*
   * mesmo que this.port = port, declarar como privado aqui
   * adicionará a variável de porta à instância SetupServer
   */
  constructor(private port = 3000) {
    super();
  }

  /*
   * Usamos um método diferente para o init em vez de usar o construtor desta
   * forma permitimos que o servidor seja usado em testes e inicialização
   * normal
   */
  public async init(): Promise<void> {
    this.setupExpress();
    this.setupControllers();
    await this.databaseSetup();
  }

  private setupExpress(): void {
    this.app.use(bodyParser.json());
    this.setupControllers();
  }

  private setupControllers(): void {
    const productController = new ProductController();
    const userController = new UsersController();
    this.addControllers([productController, userController]);
  }

  private async databaseSetup(): Promise<void> {
    await database.connect();
  }

  public async close(): Promise<void> {
    await database.close();
  }

  public getApp(): Application {
    return this.app;
  }
}
