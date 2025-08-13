import { getAllProducts, getProductById } from "@/actions/product.action";
import React from "react";
import ProductCard from "./product-card";

export const generateStaticParams = async () => {
  const products = await getAllProducts();
  return products.map((product) => ({ id: product.id }));
};

export const dynamicParams = true;

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const product = await getProductById((await params).id);

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-4 lg:px-6">
      <ProductCard product={product} />
    </div>
  );
};

export default Page;
