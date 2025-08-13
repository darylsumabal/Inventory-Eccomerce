import { getAllProducts } from "@/actions/product.action";
import TableInventory from "./table-inventory";

export default async function Page() {
  const products = await getAllProducts();

  return (
    <div className="w-full px-4 lg:px-6">
      <TableInventory products={products} />
    </div>
  );
}
