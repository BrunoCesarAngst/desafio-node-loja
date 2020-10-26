import { Controller, Post } from '@overnightjs/core';
import { Response, Request } from 'express';
import { Admin } from '@src/models/admin';
import AuthService from '@src/services/auth';
import { BaseController } from '.';

@Controller('admin')
export class AdminController extends BaseController {
  @Post('')
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const admin = new Admin(req.body);
      const newAdmin = await admin.save();
      res.status(201).send(newAdmin);
    } catch (error) {
      this.sendCreateUpdateErrorResponse(res, error);
    }
  }

  @Post('authenticate')
  public async authenticate(req: Request, res: Response): Promise<Response> {
    const admin = await Admin.findOne({ email: req.body.email });
    if (!admin) {
      return res.status(401).send({
        code: 401,
        error: 'Admin not found!',
      });
    }
    if (
      !(await AuthService.comparePassword(req.body.password, admin.password))
    ) {
      return res
        .status(401)
        .send({ code: 401, error: 'Password does not match!' });
    }
    const token = AuthService.generateToken(admin.toJSON());

    return res.send({ ...admin.toJSON(), ...{ token } });
  }
}