import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProductTabsProps {
  aboutItem: string;
}

const ProductTab = ({ aboutItem = "" }: ProductTabsProps) => {
  return (
    <div>
      <Tabs defaultValue="aboutitem" className="w-full p-4 -mt-2 ">
        <TabsList className="bg-transparent">
          <TabsTrigger value="aboutitem">About This Item</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
        </TabsList>
        <TabsContent value="aboutitem">
          <div>
            <ol className="list-disc space-y-2">
              {aboutItem.split("\n").map((about, index) => (
                <li key={index}>{about}</li>
              ))}
            </ol>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductTab;
