import QueryBuilder from "../../builder/QueryBuilder";
import { ProductSearchableFields } from "./product.constant";
import { TProduct } from "./product.interface";
import { Product } from "./product.model";

const createProductInDB = async (payload: TProduct) => {
  const result = await Product.create(payload);
  return result;
};

const getAllProductFromDB = async (query: Record<string, unknown>) => {
  const productQuery = new QueryBuilder(Product.find(), query).search(ProductSearchableFields).filter().sort().paginate().fields();

  const result = await productQuery.modelQuery;
  const meta = await productQuery.countTotal();

  return {
    meta,
    result,
  };
};

const getSingleProductFromDB = async (id: string) => {
  //   console.log("🚀 ~ getSingleProductFromDB ~ id:", id);

  const result = await Product.findById(id);
  return result;
};

const updateProductInDB = async (id: string, payload: Partial<TProduct>) => {
  const result = await Product.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
  return result;
};

const deleteProductInDB = async (id: string) => {
  const result = await Product.findByIdAndDelete(id);
  return result;
};

export const ProductServices = {
  createProductInDB,
  getAllProductFromDB,
  getSingleProductFromDB,
  updateProductInDB,
  deleteProductInDB,
};
