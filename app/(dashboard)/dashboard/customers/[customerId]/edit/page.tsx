import { Separator } from "@/components/ui/separator";
import UpdateCustomerForm from "@/components/dashboard/customer/UpdateCustomerForm";
import { getCustomerById } from "@/service/customer";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

type PageProps = {
  params: {
    customerId: string;
  };
};

const EditCustomerPage = async ({ params }: PageProps) => {
  const customerId = parseInt(params.customerId);

  if (isNaN(customerId)) {
    notFound();
  }

  // Get admin token from cookies
  const cookieStore = cookies();
  const token = cookieStore.get("admin_token")?.value;

  // Fetch customer data
  const customer = await getCustomerById(customerId, token);

  if (!customer) {
    notFound();
  }

  return (
    <div className="w-5/6 mx-auto w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 my-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Update Customer - {customer.fullName}
        </h2>
        <Link href={`/dashboard/customers/${customerId}`}>
          <Button variant="outline" size="sm">
            <ArrowLeft size={16} className="mr-2" />
            Back to Details
          </Button>
        </Link>
      </div>

      <Separator className="dark:bg-gray-500 my-4" />

      <div className="mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Update customer information below. Email cannot be changed.
        </p>
      </div>

      <UpdateCustomerForm customer={customer} />
    </div>
  );
};

export default EditCustomerPage;
