import { getAllProducts } from "@/actions/product.action";
import AddProductDialog from "./add-product-dialog";
import ProductCard from "./product-card";
import SearchProduct from "./search-product";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ name?: string }>;
}) {
  const params = await searchParams;
  const products = await getAllProducts(params?.name || "");
  console.log(process.env.DATABASE_URL);

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
      <SearchProduct />
      <div className="flex justify-between">
        <p className="font-medium text-xl">Products</p>
        <AddProductDialog />
      </div>
      <ProductCard products={products} />
    </div>
  );
}
