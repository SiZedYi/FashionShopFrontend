import BannerTwo from "@/components/banners/BannerTwo";
import LatestBlogPosts from "@/components/blog/LatestBlogPosts";
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
      <BannerTwo />
      <TestimonialsSection textCenter={true} />
      <LatestBlogPosts twoColunmHeader={false} />
      <NewsLetterTwo />
    </div>
  );
};

export default HomePage;
