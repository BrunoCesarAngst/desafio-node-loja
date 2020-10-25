import mongoose, { Document, Model } from 'mongoose';

export interface Product {
  _id?: string;
  name: string;
  description: string;
  price: number;
}

const schema = new mongoose.Schema<Product>(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
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

interface ProductModel extends Omit<Product, '_id'>, Document {}
export const Product: Model<ProductModel> = mongoose.model('Product', schema);