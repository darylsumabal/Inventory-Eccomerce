import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const userData: Prisma.ProductsCreateInput[] = [
  {
    productName: "Alice",
    price: 1,
    stock: 5,
    rating: 3,
    category: "Furniture",
    createdAt: String(new Date().toISOString()),
    imageUrl:
      "https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/e783e052-9360-4afb-adb8-c4e9c0f5db07/NIKE+AIR+MAX+NUAXIS.png",
  },
];

export async function main() {
  for (const u of userData) {
    await prisma.products.create({ data: u });
  }
}

main();
