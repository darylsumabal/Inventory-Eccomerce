// app/api/products/route.ts
import { NextResponse } from "next/server";
import { getAllProducts } from "@/actions/product.action";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name") || "";
  const products = await getAllProducts(name);
  return NextResponse.json(products);
}
