import { toast } from "sonner";

export function showToast(title: string, image: string, text: string) {
  toast.success(text, {
    description: title,
  });
}