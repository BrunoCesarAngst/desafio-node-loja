import mongoose, { Document, Model } from 'mongoose';
import AuthService from '@src/services/auth';

export interface Admin {
  _id?: string;
  name: string;
  email: string;
  password: string;
}

export enum CUSTOM_VALIDATION {
  DUPLICATED = 'DUPLICATED',
}

interface AdminModel extends Omit<Admin, '_id'>, Document {}

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: [true, 'Email must be unique'],
    },
    password: { type: String, required: true },
  },
  {
    toJSON: {
      transform: (_, ret): void => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

/**
 * Valida o e-mail e gera um erro de validação, caso contrário, ele gerará 500
 */
schema.path('email').validate(
  async (email: string) => {
    const emailCount = await mongoose.models.Admin.countDocuments({ email });
    return !emailCount;
  },
  'already exists in the database.',
  CUSTOM_VALIDATION.DUPLICATED
);

schema.pre<AdminModel>('save', async function (): Promise<void> {
  if (!this.password || !this.isModified('password')) {
    return;
  }
  try {
    const hashedPassword = await AuthService.hashPassword(this.password);
    this.password = hashedPassword;
  } catch (err) {
    console.error(`Error hashing the password for the user ${this.name}`, err);
  }
});

export const Admin: Model<AdminModel> = mongoose.model('Admin', schema);
