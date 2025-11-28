'use client'
import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useCheckoutStore } from "@/store/checkoutStore";
import { toast } from "sonner";
import { getAddresses, createAddress } from "@/service/customer";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

// Defined Zod schema for form validation
const schema = z.object({
  firstName: z.string().min(3, "First Name is required"),
  lastName: z.string().min(3, "Last Name is required"),
  address: z.string().min(5, "Address is required"),
  line2: z.string().optional(),
  state: z.string().optional(),
  phone: z.string().min(8, "Phone is required"),
  city: z.string().min(3, "City is required"),
  zip: z.string().min(5, "ZIP Code is required"),
  country: z.string().min(2, "Country is required"),
});

// Defined types for form data
type FormData = z.infer<typeof schema>;

const CheckoutForm: React.FC = () => {
  const { shippingAddress, setShippingAddress, hydrate } = useCheckoutStore();
  const [addresses, setAddresses] = useState<any[]>([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState<boolean>(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [showNewForm, setShowNewForm] = useState<boolean>(false);

  // Initialize React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: shippingAddress || undefined,
  });

  // Hydrate shipping address on mount
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  // Fetch user addresses
  useEffect(() => {
    const fetchAddresses = async () => {
      setIsLoadingAddresses(true);
      try {
        const list = await getAddresses();
        setAddresses(list || []);
        // Auto-select default address if available
        const def = (list || []).find((a: any) => a.isDefault);
        if (def) {
          setSelectedAddressId(String(def.id));
          // Map address to shippingAddress in store
          const [firstName, ...rest] = (def.fullName || "").split(" ");
          const lastName = rest.join(" ");
          const combinedAddress = [def.line1, def.line2].filter(Boolean).join(", ");
          setShippingAddress({
            firstName: firstName || def.fullName || "",
            lastName: lastName,
            address: combinedAddress,
            phone: def.phone || "",
            city: def.city || "",
            zip: def.postalCode || "",
            country: def.country || "",
          });
          toast.success("Default address selected");
        }
      } catch (error: any) {
        console.error("Failed to load addresses", error);
      } finally {
        setIsLoadingAddresses(false);
      }
    };
    fetchAddresses();
  }, [setShippingAddress]);

  // Update form when shipping address changes
  useEffect(() => {
    if (shippingAddress) {
      reset(shippingAddress);
    }
  }, [shippingAddress, reset]);

  // Handle form submission
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (showNewForm) {
      // Create new address via API then set as shipping address
      try {
        const payload = {
          fullName: `${data.firstName} ${data.lastName}`.trim(),
          phone: data.phone,
          line1: data.address,
          line2: data.line2 || "",
          city: data.city,
          state: data.state || "",
          postalCode: data.zip,
          country: data.country,
          isDefault: false,
        };
        const created = await createAddress(payload);
        toast.success("Address created and selected!");
        // Update local list and selection
        setAddresses(prev => [created, ...prev]);
        setSelectedAddressId(String(created.id));
        const [firstName, ...rest] = (created.fullName || "").split(" ");
        const lastName = rest.join(" ");
        const combinedAddress = [created.line1, created.line2].filter(Boolean).join(", ");
        setShippingAddress({
          firstName: firstName || data.firstName,
          lastName: lastName || data.lastName,
          address: combinedAddress,
          phone: created.phone,
          city: created.city,
          zip: created.postalCode,
          country: created.country,
        });
        setShowNewForm(false);
      } catch (error: any) {
        toast.error(error.message || "Failed to create address");
      }
    } else {
      setShippingAddress(data);
      toast.success("Shipping address saved successfully!");
    }
  };

  // handle address selection from saved list
  const handleSelectAddress = (value: string) => {
    setSelectedAddressId(value);
    const addr = addresses.find(a => String(a.id) === value);
    if (addr) {
      const [firstName, ...rest] = (addr.fullName || "").split(" ");
      const lastName = rest.join(" ");
      const combinedAddress = [addr.line1, addr.line2].filter(Boolean).join(", ");
      setShippingAddress({
        firstName: firstName || addr.fullName || "",
        lastName: lastName,
        address: combinedAddress,
        phone: addr.phone || "",
        city: addr.city || "",
        zip: addr.postalCode || "",
        country: addr.country || "",
      });
      toast.success("Address selected");
    }
  };

  return (
    <div>
      {/* Saved addresses selector */}
      <div className="space-y-2 mb-4">
        <Label>Saved Addresses</Label>
        <Select onValueChange={handleSelectAddress} value={selectedAddressId}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={isLoadingAddresses ? "Loading addresses..." : "Select an address"} />
          </SelectTrigger>
          <SelectContent>
            {(addresses || []).length === 0 ? (
              <SelectItem value="none" disabled>
                No saved addresses
              </SelectItem>
            ) : (
              (addresses || []).map((addr) => (
                <SelectItem key={addr.id} value={String(addr.id)}>
                  {addr.fullName} — {addr.line1}, {addr.city}
                  {addr.isDefault ? " (Default)" : ""}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
        <div className="flex justify-end">
          <Button type="button" variant="outline" onClick={() => setShowNewForm(v => !v)}>
            {showNewForm ? "Cancel New Address" : "Add New Address"}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              {...register("firstName")}
              className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-6 focus:outline-none"
            />
            {errors.firstName && (
              <span className="text-red-500">{errors.firstName.message}</span>
            )}
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              {...register("lastName")}
              className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-6 focus:outline-none"
            />
            {errors.lastName && (
              <span className="text-red-500">{errors.lastName.message}</span>
            )}
          </div>
        </div>
        <div>
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            {...register("address")}
            className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-6 focus:outline-none"
          />
          {errors.address && (
            <span className="text-red-500">{errors.address.message}</span>
          )}
        </div>
        {showNewForm && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="line2">Address Line 2 (optional)</Label>
              <Input
                id="line2"
                {...register("line2")}
                className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-6 focus:outline-none"
              />
            </div>
            <div>
              <Label htmlFor="state">State/Province (optional)</Label>
              <Input
                id="state"
                {...register("state")}
                className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-6 focus:outline-none"
              />
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              type="tel"
              id="phone"
              {...register("phone")}
              className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-6 focus:outline-none"
            />
            {errors.phone && (
              <span className="text-red-500">{errors.phone.message}</span>
            )}
          </div>
          <div>
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              {...register("city")}
              className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-6 focus:outline-none"
            />
            {errors.city && (
              <span className="text-red-500">{errors.city.message}</span>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="zip">ZIP Code</Label>
            <Input
              id="zip"
              {...register("zip")}
              className="w-full border border-gray-300 dark:border-gray-700 rounded-lg p-6 focus:outline-none"
            />
            {errors.zip && (
              <span className="text-red-500">{errors.zip.message}</span>
            )}
          </div>
          <div>
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              {...register("country")}
              className="w-full p-6 border border-gray-300 dark:border-gray-700 rounded-lg  focus:outline-none"
            />
            {errors.country && (
              <span className="text-red-500">{errors.country.message}</span>
            )}
          </div>
        </div>
        <div className="flex items-center justify-end">
          <Button type="submit">{showNewForm ? "Create & Use" : "Save"}</Button>
        </div>
      </form>
    </div>
  );
};

export default CheckoutForm;
