import { Separator } from "@/components/ui/separator";
import { X } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

export function showToast(title:string,image:string,text:string){
    const id = toast(
        <div className="text-left w-full">
          <div className="flex items-start justify-between">
            <h2 className="text font-bold my-2">{title}</h2>
            <button
              aria-label="Close"
              onClick={() => toast.dismiss(id)}
              className="ml-4 text-sm opacity-70 hover:opacity-100"
            >
              <X />
            </button>
          </div>
          <Separator />
          <div className="flex items-center justify-start gap-4 mt-2">
            <Image src={image} alt="product" width={50} height={50} />
            <p>{text}</p>
          </div>
        </div>
      );
    return id;
}