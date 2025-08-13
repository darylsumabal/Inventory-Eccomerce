"use client";
import {
  deleteProduct,
  editProduct,
  getProductById,
} from "@/actions/product.action";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { upload } from "@vercel/blob/client";
import { Loader2Icon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { productSchema } from "../add-product-dialog";

type Product = Awaited<ReturnType<typeof getProductById>>;
type ProductCard = {
  product: Product;
};

const ProductCard = ({ product }: ProductCard) => {
  const [dialog, setDialog] = useState(false);
  const [progress, setProgress] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const router = useRouter();
  const formProduct = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      productName: product?.productName,
      price: product?.price,
      stock: product?.stock,
      rating: product?.rating,
      imageUrl: product?.imageUrl,
    },
  });

  useEffect(() => {
    if (dialog && product?.imageUrl) {
      setPreview(product.imageUrl); // show existing product image
    }
  }, [dialog, product]);

  async function handleDeleteProduct(id: string) {
    try {
      await deleteProduct(id);
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      router.push("/product");
      toast.success("Product deleted!");
    }
  }

  async function onSubmitProduct(values: z.infer<typeof productSchema>) {
    setProgress(!progress);

    try {
      let imageUrl = product?.imageUrl || "";

      if (selectedFile) {
        const filename = selectedFile.name;

        const uploaded = await upload(
          `project/projectId/${filename}`,
          selectedFile,
          {
            access: "public",
            handleUploadUrl: "/api/upload",
          }
        );

        formProduct.setValue("imageUrl", uploaded.url);
        imageUrl = uploaded.url;
      }

      await editProduct(product?.id ?? "", {
        ...values,
        imageUrl,
      });
    } catch (error) {
      console.log(error);
    } finally {
      toast.success("Product edited successfully");
      setSelectedFile(null);
      setProgress(progress);
      setDialog(!dialog);
      formProduct.reset();
    }
  }

  return (
    <Card key={product?.id} className="w-full">
      <CardContent>
        <div className="flex gap-4">
          <Image
            src={product?.imageUrl ?? ""}
            alt={product?.productName ?? ""}
            height={150}
            width={150}
            className="h-auto w-auto"
            priority
          />
          <div>
            <p className="text-xl leading-none font-bold text-foreground">
              {product?.productName}
            </p>
            <p>${product?.price}</p>
            <p>Stock: {product?.stock}</p>
            <div className="space-x-2">
              {/* <Button variant="default">Edit</Button> */}
              <Dialog open={dialog} onOpenChange={setDialog}>
                <DialogTrigger asChild>
                  <Button variant="default">Edit Product</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Edit a Product</DialogTitle>
                    <DialogDescription>
                      Edit a product you like
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...formProduct}>
                    <form
                      onSubmit={formProduct.handleSubmit(onSubmitProduct)}
                      className="space-y-8"
                    >
                      <FormField
                        control={formProduct.control}
                        name="productName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Product Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={formProduct.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Price</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                onFocus={(e) => {
                                  if (e.target.value === "0") {
                                    e.target.value = "";
                                  }
                                }}
                                {...field}
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={formProduct.control}
                        name="stock"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Stock Quantity</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                onFocus={(e) => {
                                  if (e.target.value === "0") {
                                    e.target.value = "";
                                  }
                                }}
                                {...field}
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={formProduct.control}
                        name="rating"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Rating</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                onFocus={(e) => {
                                  if (e.target.value === "0") {
                                    e.target.value = "";
                                  }
                                }}
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={formProduct.control}
                        name="imageUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Image</FormLabel>
                            <FormControl>
                              <div className="space-y-2">
                                {preview && (
                                  <Image
                                    src={preview}
                                    alt="Preview"
                                    width={150}
                                    height={150}
                                    className="rounded-md object-cover"
                                  />
                                )}
                                <Input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    if (e.target.files?.[0]) {
                                      const file = e.target.files[0];
                                      setSelectedFile(file);
                                      setPreview(URL.createObjectURL(file));
                                      field.onChange(file.name);
                                    }
                                  }}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" disabled={progress}>
                          {progress && <Loader2Icon className="animate-spin" />}
                          Create
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
              <Button
                variant="destructive"
                onClick={() => handleDeleteProduct(product?.id ?? "")}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
