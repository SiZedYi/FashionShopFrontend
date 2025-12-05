import CategorySection from "@/components/category/CategorySection";
import HeroBanner from "@/components/hero/HeroBanner";
import NewsLetterTwo from "@/components/newsLetter/NewsLetterTwo";
import BenefitsSection from "@/components/others/BenefitSection";
import Loader from "@/components/others/Loader";
import TestimonialsSection from "@/components/others/Testimonials";
import ProductsCollectionTwo from "@/components/products/ProductsCollectionTwo";
import React, { Suspense } from "react";

const HomePage = () => {
  return (
    <div className="overflow-hidden">
      <HeroBanner />
      <Suspense fallback={<Loader />}>
        <CategorySection />
      </Suspense>
      <ProductsCollectionTwo />
      <BenefitsSection textCenter={true} />
      <TestimonialsSection textCenter={true} />
      <NewsLetterTwo />
    </div>
  );
};

export default HomePage;
