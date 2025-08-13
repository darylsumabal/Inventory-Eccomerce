import { SectionCards } from "@/components/section-cards";
import PopularProduct from "@/components/popular-product";
import { getAllProducts } from "@/actions/product.action";

export default async function Page() {
  const product = await getAllProducts();

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
      <SectionCards />
      <div className="px-4 lg:px-6 flex flex-col gap-4 ">
        <PopularProduct products={product} />
        {/* <ChartAreaInteractive /> */}
      </div>
      {/* <DataTable data={data} /> */}
    </div>
  );
}
