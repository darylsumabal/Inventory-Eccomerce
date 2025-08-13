"use client";

import { getAllProducts } from "@/actions/product.action";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type Product = Awaited<ReturnType<typeof getAllProducts>>;
type ProductCard = {
  products: Product;
};
const ProductCard = ({ products }: ProductCard) => {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(550px,1fr))] gap-4">
      {products?.map((i) => {
        const plantUrl = `/product/${i.id}`;

        return (
          <Link key={i.id} href={plantUrl} prefetch={true}>
            <Card key={i.id} className="w-full h-full">
              <CardHeader>
                <div className="flex justify-center">
                  <Image
                    src={i.imageUrl}
                    alt={i.productName}
                    height={150}
                    width={150}
                    className="h-auto w-auto"
                    priority
                  />
                </div>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center gap-2">
                <p className="text-xl leading-none font-bold text-foreground">
                  {i.productName}
                </p>
                <p>${i.price}</p>
                <p>Stock: {i.stock}</p>
                <div className="flex gap-1 ">
                  <Star />
                  <Star />
                  <Star />
                  <Star />
                  <Star />
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
};

export default ProductCard;
