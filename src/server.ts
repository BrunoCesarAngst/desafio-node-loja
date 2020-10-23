import './util/module-alias';
import { Server } from '@overnightjs/core';
import { Application } from 'express';
import bodyParser from 'body-parser';
import { ProductController } from './controllers/Product';

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
  }

  private setupExpress(): void {
    this.app.use(bodyParser.json());
    this.setupControllers();
  }

  private setupControllers(): void {
    const productController = new ProductController();
    this.addControllers([productController]);
  }

  public getApp(): Application {
    return this.app;
  }
}
