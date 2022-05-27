import { ServerRoute, Request } from '@hapi/hapi';
import mongoose, { Schema } from 'mongoose';
import * as config from './config/dev.json';

interface IProduct {
  title: string;
  description?: string;
  price: string;
  image: string;
}

const productSchema = new Schema<IProduct>({
  title: String,
  description: String,
  price: String,
  image: String,
});

export const db = {
  connect: async () => {
    await mongoose.connect(
      config.DB_HOST + '/' + config.DB_NAME,
      config.DB_OPTS
    );
  },
  Products: mongoose.model<IProduct>('Products', productSchema),
};

// Connect to db
db.connect();

// Create a db and collection
const setupDbCollection = async () => {
  // Create a new mongodb
  const conn = mongoose.createConnection(
    config.DB_HOST + '/' + config.DB_NAME,
    config.DB_OPTS
  );

  // Create a new collection
  const newModel = await conn.model('Orders', productSchema);
  const data = {};
  new newModel(data).save();
};

const getAllProducts = async (request: Request, h: any) => {
  const products = await db.Products.find({});
  request.log(['implementation'], `GET 200 /products ${products.length}`);
  return h.response(products);
};

const upsertProduct = async (request: Request, h: any): Promise<IProduct> => {
  const product = await db.Products.findById(request.params.id);

  if (!product) {
    const newProduct = new db.Products(request.payload);
    await newProduct.save();
    request.log(['implementation'], `POST 201 /product ${newProduct}`);
    return h.response(newProduct.toObject()).created();
  }

  // @ts-ignore
  product.title = request.payload.title;
  // @ts-ignore
  product.description = request.payload.description;
  // @ts-ignore
  product.price = request.payload.price;
  // @ts-ignore
  product.image = request.payload.image;
  await product.save();
  request.log(['implementation'], `PUT 201 /product/${request.params.id}`);
  return h.response(product.toObject());
};

const getProduct = async (request: Request, h: any) => {
  const product = await db.Products.findById(request.params.id);
  request.log(['implementation'], `GET 200 /product/${request.params.id}`);
  return h.response(product?.toObject());
};

const deleteProduct = async (request: Request, h: any) => {
  const product = await db.Products.findByIdAndDelete(request.params.id);
  await product?.save();
  request.log(['implementation'], `DELETE 204 /product/${request.params.id}`);
  return h.response().code(204);
};

export const productsRoutes: ServerRoute[] = [
  { method: 'POST', path: '/product', handler: upsertProduct },
  { method: 'GET', path: '/products', handler: getAllProducts },
  { method: 'GET', path: '/product/{id}', handler: getProduct },
  { method: 'PUT', path: '/product/{id}', handler: upsertProduct },
  { method: 'DELETE', path: '/product/{id}', handler: deleteProduct },
];
