import mongoose, { Document, Model, Schema } from 'mongoose';

export enum Department {
  TOYS = 'toys',
  CELL_PHONES = 'cell_phones',
  COMPUTING = 'Computing',
  ELECTRONICS = 'electronics',
  FASHION = 'fashion',
}

export interface Product {
  _id?: string;
  name: string;
  department: Department;
  description: string;
  price: number;
  quantity: number;
}

const schema = new mongoose.Schema<Product>(
  {
    name: {
      type: String,
      required: 'The name is required',
      unique: true,
      min: 3,
    },
    department: {
      type: Department,
      required: 'The department is required',
      lowercase: true,
    },
    description: { type: String },
    price: {
      type: Number,
      required: 'The price is required',
      // set: setPrice,
      // get: getPrice,
    },
    quantity: { type: Number, required: 'The quantity is required' },
    admin: { type: Schema.Types.ObjectId, ref: 'Admin', required: true },
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

// function setPrice(number: number) {
//   return number * 100;
// }

// function getPrice(number: number) {
//   return (number / 100).toFixed(2);
// }

export interface ProductInput {
  _id?: string;
  name: string;
  price: number;
  category: Department;
  description: string;
  quantity: number;
}

export interface ProductEdit {
  _id?: string;
  name?: string;
  price?: number;
  category?: Department;
  description?: string;
  quantity?: number;
}

export const categoryToString = (input: string): string => {
  switch (input) {
    case 'toys': {
      return Department.TOYS;
    }
    case 'cell_phones': {
      return Department.CELL_PHONES;
    }
    case 'computing': {
      return Department.COMPUTING;
    }
    case 'electronics': {
      return Department.ELECTRONICS;
    }
    case 'fashion': {
      return Department.FASHION;
    }
    default:
      throw new Error('Invalid Department');
  }
};

interface ProductModel extends Omit<Product, '_id'>, Document {}
export const Product: Model<ProductModel> = mongoose.model('Product', schema);
