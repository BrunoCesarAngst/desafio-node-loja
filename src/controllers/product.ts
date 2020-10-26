import { Controller, Get, Middleware, Post } from '@overnightjs/core';
import { authMiddleware } from '@src/middlewares/auth';
import { Product } from '@src/models/products';
import { Request, Response } from 'express';
import mongoose from 'mongoose';

@Controller('products')
export class ProductController {
  @Get('')
  public getAllProducts(_: Request, res: Response): void {
    res.send([
      {
        name: 'Product A',
        department: 'toys',
        description: 'first test product',
        price: 100.0,
        quantity: 15,
      }
    ]);
  }

  @Post('')
  @Middleware(authMiddleware)
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const products = new Product({...req.body, ...{admin: req.decoded?.id}});
      const result = await products.save();
      res.status(201).send(result);
    } catch (err) {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(422).send({error: err.message});
      } else {
        res.status(500).send({error: 'Internal server error'});
      }
    }
  }
}
