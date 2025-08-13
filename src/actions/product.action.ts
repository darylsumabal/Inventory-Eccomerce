"use server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function createProduct(data: Prisma.ProductsCreateInput) {
  try {
    const newProduct = await prisma.products.create({
      data: {
        ...data,
      },
    });
    console.log(newProduct);
    revalidatePath("/product");
    return newProduct;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getAllProducts(searchTerm?: string) {
  try {
    const productList = await prisma.products.findMany({
      where: searchTerm
        ? {
            productName: {
              contains: searchTerm,
              mode: "insensitive",
            },
          }
        : undefined,
      orderBy: {
        createdAt: "desc",
      },
    });

    return productList;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getProductById(id: string) {
  try {
    const product = await prisma.products.findUnique({
      where: {
        id: id,
      },
    });
    return product;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function editProduct(
  id: string,
  data: Prisma.ProductsUpdateInput
) {
  try {
    const updateProduct = await prisma.products.update({
      where: { id },
      data: {
        ...data,
      },
    });
    revalidatePath("/product");
    return updateProduct;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteProduct(id: string) {
  try {
    const deleteProduct = await prisma.products.delete({
      where: {
        id: id,
      },
    });
    revalidatePath("/product");
    return deleteProduct;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
