"use client";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import z from "zod";
const formSchema = z.object({
  productName: z.string().min(0, {
    message: "Username must be at least 2 characters.",
  }),
});

const SearchProduct = () => {
  const router = useRouter();
  const params = useSearchParams();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: "",
    },
  });

  const updateUrlParam = (value: string) => {
    const newParams = new URLSearchParams(params.toString());
  
    if (value) {
      newParams.set("name", value);
    } else {
      newParams.delete("name");
    }
    router.replace(`?${newParams.toString()}`, { scroll: false });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) =>
          updateUrlParam(values.productName)
        )}
      >
        <FormField
          control={form.control}
          name="productName"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative flex items-center rounded-md border focus-within:ring-1 focus-within:ring-ring pl-2">
                  <Search className="h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search products"
                    className="border-0 focus-visible:ring-0 shadow-none"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                    }}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default SearchProduct;
