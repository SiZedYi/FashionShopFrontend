import React, { Fragment } from "react";
import ProductGallery from "@/components/product/ProductGallery";
import ProductDetails from "@/components/product/ProductDetails";
import { productsData } from "@/data/products/productsData";
import BreadcrumbComponent from "@/components/others/Breadcrumb";
import { getProductDetail } from "@/service/product";
import ProductForm from "@/components/dashboard/forms/ProductForm";

const ProductDetailsPage = async ({
  params,
}: {
  params: { productId: string };
}) => {
  // get product data here based on params

  const product = await getProductDetail(params.productId);

  return (
    <div className="w-5/6 mx-auto p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <div className="mb-4">
        <h1 className="text-3xl font-bold">Product Details</h1>
      </div>
      {!product && <div>No product found.</div>}
      {product && (
        <Fragment>
          <ProductForm action="update" productId={params.productId} product={product} />
        </Fragment>
      )}
    </div>
  );
};

export default ProductDetailsPage;
