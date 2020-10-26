import bcrypt from 'bcrypt';
import config from 'config';
import * as jwt from 'jsonwebtoken';
import { Admin } from '../models/admin';

//versão do usuário que é enviada via API e decodificada do Json Web Token
export interface DecodedUser extends Omit<Admin, '_id'> {
  id: string;
}

export default class AuthService {
  public static async hashPassword(
    password: string,
    salt = 10
  ): Promise<string> {
    return await bcrypt.hash(password, salt);
  }

  public static async comparePassword(
    password: string,
    hashPassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashPassword);
  }

  // public static generateToken(payload: object): string {
  public static generateToken(payload: Record<string, unknown>): string {
    return jwt.sign(payload, config.get('App.auth.key'), {
      expiresIn: config.get('App.auth.tokenExpiresIn'),
    });
  }

  public static decodeToken(token: string): DecodedUser {
    return jwt.verify(token, config.get('App.auth.key')) as DecodedUser;
  }
}
