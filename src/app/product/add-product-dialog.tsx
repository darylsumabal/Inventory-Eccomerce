"use client";

import { createProduct } from "@/actions/product.action";
import { Button } from "@/components/ui/button";
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
import { Loader2Icon, PlusCircle } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { DevTool } from "@hookform/devtools";
import Combobox from "@/components/combo-box";

export const productSchema = z.object({
  productName: z.string().min(2, {
    message: "Product must be at least 2 characters",
  }),
  price: z.number().min(1, {
    message: "Price must be at least 1",
  }),
  stock: z.number().min(1, {
    message: "Stock must at least 1",
  }),
  rating: z.number().min(1, {
    message: "Rating must at least 1",
  }),
  category: z.string().min(1, {
    message: "Category is required",
  }),
  imageUrl: z.string().min(1, {
    message: "Image Required",
  }),
});

const AddProductDialog = () => {
  const [dialog, setDialog] = useState(false);
  const [progress, setProgress] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const formProduct = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      productName: "",
      price: 0,
      stock: 0,
      rating: 0,
      category: "",
      imageUrl: "",
    },
  });

  async function onSubmitProduct(values: z.infer<typeof productSchema>) {
    setProgress(!progress);
    if (!selectedFile) {
      throw new Error("No file selected");
    }

    const filename = selectedFile.name;

    try {
      const uploaded = await upload(
        `project/projectId/${filename}`,
        selectedFile,
        {
          access: "public",
          handleUploadUrl: "/api/upload",
        }
      );

      formProduct.setValue("imageUrl", uploaded.url);

      await createProduct({ ...values, imageUrl: uploaded.url });
    } catch (error) {
      console.log(error);
    } finally {
      toast.success("Product created successfully");
      setSelectedFile(null);
      setProgress(progress);
      setDialog(!dialog);
      formProduct.reset();
    }
  }

  return (
    <Dialog open={dialog} onOpenChange={setDialog}>
      <DialogTrigger asChild>
        <Button variant="default">
          <PlusCircle /> Create Product
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a Product</DialogTitle>
          <DialogDescription>Create a product you like</DialogDescription>
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
                    <Input placeholder="shadcn" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={formProduct.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Combobox value={field.value} onChange={field.onChange} />
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
                      onChange={(e) => field.onChange(Number(e.target.value))}
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
                      onChange={(e) => field.onChange(Number(e.target.value))}
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
                      onChange={(e) => field.onChange(Number(e.target.value))}
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
        <DevTool control={formProduct.control} />
      </DialogContent>
    </Dialog>
  );
};

export default AddProductDialog;
