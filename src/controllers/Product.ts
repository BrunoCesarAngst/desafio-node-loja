import { Controller, Get } from "@overnightjs/core";
import { Request, Response } from "express";

@Controller("products")
export class ProductController {
  @Get("")
  public getProductForgeLoggedUser(_: Request, res: Response): void {
    res.send([
      {
        code: "1",
        name: "Product A",
        description: "first test product",
        price: 100.0,
        images: [
          {
            code: "111",
            file: "string",
          },
          {
            code: "111",
            file: "string",
          },
        ],
      },
      {
        code: "1",
        name: "Product A",
        description: "first test product",
        price: 100.0,
        images: [
          {
            code: "111",
            file: "string",
          },
          {
            code: "111",
            file: "string",
          },
        ],
      },
    ]);
  }
}
