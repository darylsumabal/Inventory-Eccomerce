"use client";

import { ShoppingBag, Star } from "lucide-react";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "./ui/card";
import { getAllProducts } from "@/actions/product.action";

type Product = Awaited<ReturnType<typeof getAllProducts>>;

type PopularProductProps = {
  products: Product;
};

const PopularProduct = ({ products }: PopularProductProps) => {
  return (
    <Card>
      <CardHeader className="border-b-2">
        <p className="font-medium">Popular Products</p>
      </CardHeader>
      <CardContent className="h-96 overflow-y-scroll">
        {products?.map((i) => (
          <div
            key={i.id}
            className="flex items-center justify-between gap-10 border-b-2"
          >
            <div className="flex gap-2 py-2">
              <div className="flex justify-center">
                <Image
                  src={i.imageUrl}
                  alt={i.productName}
                  height={70}
                  width={70}
                />
              </div>
              <div className="text-xs flex flex-col justify-center gap-2">
                <p className="leading-none font-bold text-foreground">
                  {i.productName}
                </p>

                <div className="flex items-center gap-2">
                  <p className="font-extrabold">${i.price}</p>
                  <p>|</p>
                  <div className="flex gap-0.5">
                    <Star size={10} />
                    <Star size={10} />
                    <Star size={10} />
                    <Star size={10} />
                    <Star size={10} />
                  </div>
                </div>
              </div>
            </div>

            <div className="text-xs">
              <p className="flex items-center gap-1">
                <ShoppingBag size={15} />
                <span>100k Sold</span>
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default PopularProduct;
