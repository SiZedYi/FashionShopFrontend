import CategoryForm from "@/components/dashboard/forms/CategoryForm";
import { cookies } from "next/headers";

const AddCategoryPage = () => {
  const cookieStore = cookies();
  const token = cookieStore.get("admin_token")?.value || "";

  return (
    <div className="w-full">
      <CategoryForm action="add" token={token} />
    </div>
  );
};

export default AddCategoryPage;
