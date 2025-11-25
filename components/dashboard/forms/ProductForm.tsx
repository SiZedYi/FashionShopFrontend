"use client";
import React, { useState, useMemo, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pill } from "@/components/ui/pill";
import { getAllCategories, type Category } from "@/service/category";
import { createProduct, updateProduct } from "@/service/product";
import { COLOR_OPTIONS } from "@/const/color";

// Define the schema for form validation
const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  sku: z
    .string()
    .min(1, "SKU is required")
    .regex(/^[a-z0-9]+(?:_[a-z0-9]+)*$/, "SKU must be lowercase snake_case (letters, numbers, underscores)"),
  price: z.string().min(1, "Price is required"),
  stockQuantity: z.preprocess(
    (val) => {
      if (val === "" || val === undefined || val === null) return undefined;
      const num = Number(val);
      return isNaN(num) ? undefined : num;
    },
    z.number({ required_error: "Stock quantity is required" }).int().min(0, "Stock quantity must be ≥ 0")
  ),
  category: z.array(z.string()).min(1, "At least one category is required"),
  brand: z.string().min(1, "Brand is required"),
  description: z.string().min(1, "Description is required"),
  aboutItem: z.string().optional(),
  color: z.array(z.string()).min(1, "At least one color is required"),
  images: z
    .record(
      z.string(),
      z.array(z.instanceof(File)).min(1, "At least one image required for this color")
    )
    .refine((rec) => Object.keys(rec).length > 0, {
      message: "Images are required for selected colors",
    }),
  discount: z
    .preprocess((val) => {
      if (val === "" || val === undefined || val === null) return undefined;
      const num = Number(val);
      return isNaN(num) ? undefined : num;
    }, z.number().min(0).max(100).optional()),
});

type ProductFormData = z.infer<typeof productSchema>;

type ProductFormProps = {
  action: "add" | "update";
  productId?: number | string;
  product?: any; // product detail from API for prefilling (images not required)
};
const ProductForm = ({ action, productId, product }: ProductFormProps) => {
  const {
    handleSubmit,
    register,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      sku: "",
      price: "",
      stockQuantity: undefined as unknown as number,
      category: [],
      brand: "",
      description: "",
      aboutItem: "",
      images: {},
      color: [],
      discount: undefined,
    },
  });

  const selectedCategories = watch("category");
  const selectedColors = watch("color");
  const imagesRecord = watch("images");
  const nameValue = watch("name");
  const skuValue = watch("sku");

  // Local input states for add boxes
  const [categoryInput, setCategoryInput] = useState("");
  const [colorInput, setColorInput] = useState("");
  const [categoryOptions, setCategoryOptions] = useState<string[]>([]);
  const [categoriesRaw, setCategoriesRaw] = useState<Category[]>([]);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showColorDropdown, setShowColorDropdown] = useState(false);
  const [skuEdited, setSkuEdited] = useState(false);

  // Load all categories once on mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const cats = await getAllCategories();
        if (mounted && Array.isArray(cats)) {
          setCategoriesRaw(cats);
          const names = Array.from(new Set(cats.map((c) => c.name).filter(Boolean)));
          setCategoryOptions(names);
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error("Failed to load categories", e);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Helpers to generate/sanitize SKU
  const toSnakeCase = (val: string) =>
    val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "")
      .replace(/_+/g, "_");

  // Auto-generate SKU from name when user hasn't manually edited SKU
  useEffect(() => {
    if (!skuEdited) {
      setValue("sku", toSnakeCase(nameValue || ""));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nameValue, skuEdited]);

  // Prefill form values when editing an existing product
  useEffect(() => {
    if (action !== "update" || !product) return;

    // Core fields
    if (product.name) setValue("name", product.name);
    const priceStr =
      typeof product.price === "number" ? String(product.price) : product.price ?? "";
    setValue("price", priceStr);
    if (product.brand) setValue("brand", product.brand);
    if (product.description) setValue("description", product.description);
    if (product.aboutItem) setValue("aboutItem", product.aboutItem);
    if (typeof product.discount === "number") setValue("discount", product.discount);

    // Stock quantity can be stockQuantity or stockItems depending on API shape
    const stock =
      typeof product.stockQuantity === "number"
        ? product.stockQuantity
        : typeof product.stockItems === "number"
        ? product.stockItems
        : undefined;
    if (typeof stock === "number") setValue("stockQuantity", stock);

    // Colors can be array or comma separated string
    let colors: string[] = [];
    if (Array.isArray(product.color)) {
      colors = product.color as string[];
    } else if (typeof product.color === "string") {
      colors = (product.color as string)
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean);
    } else if (Array.isArray(product.colors)) {
      colors = (product.colors as any[])
        .map((c) => (typeof c === "string" ? c : c?.name))
        .filter(Boolean);
    }
    if (colors.length) setValue("color", Array.from(new Set(colors)));

    // Categories: attempt several shapes; prefer mapping IDs to names when available
    let categoryNames: string[] = [];
    if (Array.isArray(product.categories)) {
      categoryNames = (product.categories as any[])
        .map((c) => (typeof c === "string" ? c : c?.name))
        .filter(Boolean);
    } else if (Array.isArray(product.categoryIds) && categoriesRaw.length) {
      const byId = new Map(categoriesRaw.map((c) => [c.id, c.name] as const));
      categoryNames = (product.categoryIds as number[])
        .map((id) => byId.get(id))
        .filter((n): n is string => typeof n === "string");
    } else if (typeof product.category === "string") {
      categoryNames = (product.category as string)
        .split(",")
        .map((s: string) => s.trim())
        .filter(Boolean);
    }
    if (categoryNames.length) setValue("category", Array.from(new Set(categoryNames)));

    // SKU: use provided or derive from name; mark as edited to avoid overwrite by generator
    const preSku = product.sku ? String(product.sku) : toSnakeCase(product.name || "");
    setValue("sku", preSku, { shouldValidate: true });
    setSkuEdited(true);
  }, [action, product, categoriesRaw, setValue]);

  const filteredCategoryOptions = useMemo(
    () =>
      categoryOptions.filter(
        (c) => c.toLowerCase().includes(categoryInput.toLowerCase()) && !selectedCategories.includes(c)
      ),
    [categoryInput, selectedCategories, categoryOptions]
  );
  const filteredColorOptions = useMemo(
    () =>
      COLOR_OPTIONS.filter(
        (opt) => opt.name.toLowerCase().includes(colorInput.toLowerCase()) && !selectedColors.includes(opt.name)
      ),
    [colorInput, selectedColors]
  );

  const getColorClass = (name: string) =>
    COLOR_OPTIONS.find((o) => o.name === name)?.className;

  const addCategory = (val: string) => {
    if (!val) return;
    if (selectedCategories.includes(val)) return;
    setValue("category", [...selectedCategories, val]);
    setCategoryInput("");
  };
  const removeCategory = (val: string) => {
    setValue("category", selectedCategories.filter((c) => c !== val));
  };
  const addColor = (val: string) => {
    if (!val) return;
    if (selectedColors.includes(val)) return;
    setValue("color", [...selectedColors, val]);
    // ensure images record key exists
    setValue("images", { ...imagesRecord, [val]: [] });
    setColorInput("");
  };
  const removeColor = (val: string) => {
    const newColors = selectedColors.filter((c) => c !== val);
    const { [val]: _, ...restImages } = imagesRecord || {};
    setValue("color", newColors);
    setValue("images", restImages);
  };

  const handleImagesChange = (color: string, files: FileList | null) => {
    if (!files) return;
    const arr = Array.from(files);
    setValue("images", { ...imagesRecord, [color]: arr });
  };

  const onSubmit = async (data: ProductFormData) => {
    // Transform form state to API contract
    const colorCsv = (data.color || []).join(",");

    // Map selected category names to IDs using loaded categories
    const nameToId = new Map(categoriesRaw.map((c) => [c.name, c.id] as const));
    const categoryIds = (data.category || [])
      .map((name) => nameToId.get(name))
      .filter((v): v is number => typeof v === "number");

    // Flatten images from record<string, File[]> to File[]
    const imagesFlat: File[] = Object.values(data.images || {})
      .filter((arr): arr is File[] => Array.isArray(arr))
      .flat();

    // Build request object per backend shape
    const productRequest: Record<string, any> = {
      name: data.name,
      sku: data.sku,
      price: Number(data.price),
      stockQuantity: data.stockQuantity,
      brand: data.brand,
      description: data.description,
      aboutItem: data.aboutItem ?? "",
      discount: data.discount ?? 0,
      color: colorCsv,
      categoryIds,
      // Provide sensible defaults for fields the API may expect
      isActive: true,
    };

    try {
      let res: Response;
      if (action === "update") {
        if (!productId) throw new Error("Missing productId for update");
        res = await updateProduct(productId, productRequest, imagesFlat);
      } else {
        res = await createProduct(productRequest, imagesFlat);
      }

      if (!res.ok) {
        let message = `${res.status} ${res.statusText}`;
        try {
          const body = await res.json();
          if (body?.message) message = body.message;
        } catch (_e) {
          // ignore
        }
        throw new Error(message);
      }

      // Success: reset form
      reset();
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("Submit product error:", err);
    }
  };

  return (
    <div className="max-w-screen mx-auto w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 my-4">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {action === "update" ? "Update Product" : "Add New Product"}
      </h2>
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left column: product details */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-white">
              Product Name
            </Label>
            <Input
              id="name"
              type="text"
              className="mt-1 p-2 block w-full rounded-md border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
              {...register("name")}
            />
            {errors.name && <span className="text-red-500">{errors.name.message}</span>}
          </div>

          <div>
            <Label htmlFor="sku" className="block text-sm font-medium text-gray-700 dark:text-white">
              SKU
            </Label>
            <Input
              id="sku"
              type="text"
              placeholder="auto-generated from product name"
              className="mt-1 p-2 block w-full rounded-md border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
              {...register("sku", {
                onChange: (e) => {
                  const sanitized = (e.target.value || "").toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "").replace(/_+/g, "_");
                  setValue("sku", sanitized, { shouldValidate: true });
                  setSkuEdited((sanitized || "").length > 0);
                },
              })}
              defaultValue={skuValue}
            />
            {errors.sku && <span className="text-red-500">{errors.sku.message}</span>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-white">
                Price
              </Label>
              <Input
                id="price"
                type="text"
                className="mt-1 p-2 block w-full rounded-md border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                {...register("price")}
              />
              {errors.price && <span className="text-red-500">{errors.price.message}</span>}
            </div>
            <div>
              <Label htmlFor="discount" className="block text-sm font-medium text-gray-700 dark:text-white">
                Discount (%)
              </Label>
              <Input
                id="discount"
                type="number"
                min={0}
                max={100}
                className="mt-1 p-2 block w-full rounded-md border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                {...register("discount")}
              />
              {errors.discount && <span className="text-red-500">{errors.discount.message}</span>}
            </div>
          </div>

          <div>
            <Label htmlFor="stockQuantity" className="block text-sm font-medium text-gray-700 dark:text-white">
              Stock Quantity
            </Label>
            <Input
              id="stockQuantity"
              type="number"
              min={0}
              className="mt-1 p-2 block w-full rounded-md border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
              {...register("stockQuantity")}
            />
            {errors.stockQuantity && (
              <span className="text-red-500">{errors.stockQuantity.message as string}</span>
            )}
          </div>

          <div>
            <Label htmlFor="brand" className="block text-sm font-medium text-gray-700 dark:text-white">
              Brand
            </Label>
            <Input
              id="brand"
              type="text"
              className="mt-1 p-2 block w-full rounded-md border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
              {...register("brand")}
            />
            {errors.brand && <span className="text-red-500">{errors.brand.message}</span>}
          </div>

          

          <div>
            <Label className="block text-sm font-medium text-gray-700 dark:text-white">Categories</Label>
            <div className="mt-1 flex flex-wrap gap-2">
              {selectedCategories.map((c) => (
                <Pill key={c} text={c} onRemove={() => removeCategory(c)} colorClass="bg-indigo-600" />
              ))}
            </div>
            <div className="relative mt-2">
              <Input
                placeholder="Type & Enter to add category"
                value={categoryInput}
                onChange={(e) => setCategoryInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addCategory(categoryInput.trim());
                  }
                }}
                onFocus={() => setShowCategoryDropdown(true)}
                onClick={() => setShowCategoryDropdown(true)}
                onBlur={() => setTimeout(() => setShowCategoryDropdown(false), 150)}
                className="p-2 block w-full rounded-md border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
              />
              {showCategoryDropdown && (
                <div className="absolute left-0 right-0 mt-1 border rounded p-2 bg-white dark:bg-slate-950 text-sm space-y-1 max-h-52 overflow-y-auto z-50 shadow-lg">
                  {filteredCategoryOptions.length > 0 ? (
                    filteredCategoryOptions.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => addCategory(opt)}
                        className="block w-full text-left px-2 py-1 rounded hover:bg-blue-100 dark:hover:bg-blue-900"
                      >
                        {opt}
                      </button>
                    ))
                  ) : (
                    <div className="text-gray-500">No categories available</div>
                  )}
                </div>
              )}
            </div>
            {errors.category && <span className="text-red-500">{errors.category.message}</span>}
          </div>

          <div>
            <Label className="block text-sm font-medium text-gray-700 dark:text-white">Available Colors</Label>
            <div className="mt-1 flex flex-wrap gap-2">
              {selectedColors.map((c) => (
                <Pill key={c} text={c} onRemove={() => removeColor(c)} colorClass={getColorClass(c)} />
              ))}
            </div>
            <div className="relative mt-2">
              <Input
                placeholder="Type & Enter to add color"
                value={colorInput}
                onChange={(e) => setColorInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addColor(colorInput.trim());
                  }
                }}
                onFocus={() => setShowColorDropdown(true)}
                onClick={() => setShowColorDropdown(true)}
                onBlur={() => setTimeout(() => setShowColorDropdown(false), 150)}
                className="p-2 block w-full rounded-md border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500 dark:bg-slate-950"
              />
              {showColorDropdown && (
                <div className="absolute left-0 right-0 mt-1 border rounded p-2 bg-white dark:bg-slate-950 text-sm space-y-1 max-h-52 overflow-y-auto z-50 shadow-lg">
                  {filteredColorOptions.map((opt) => (
                    <button
                      key={opt.name}
                      type="button"
                      onClick={() => addColor(opt.name)}
                      className="flex items-center gap-2 w-full text-left px-2 py-1 rounded hover:bg-emerald-100 dark:hover:bg-emerald-900"
                    >
                      <span className={`inline-block h-3 w-3 rounded-full ${opt.className.replace(' text-gray-900 border border-gray-300','').replace('bg-white','bg-gray-200')}`}></span>
                      {opt.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {errors.color && <span className="text-red-500">{errors.color.message}</span>}
          </div>

          <div>
            <Label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-white">
              Description
            </Label>
            <textarea
              id="description"
              className="mt-1 p-2 block border bg-white dark:bg-slate-950 rounded-md w-full  border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
              {...register("description")}
            />
            {errors.description && <span className="text-red-500">{errors.description.message}</span>}
          </div>

          <div>
            <Label htmlFor="aboutItem" className="block text-sm font-medium text-gray-700 dark:text-white">
              About Item
            </Label>
            <textarea
              id="aboutItem"
              className="mt-1 border p-2 block w-full rounded-md dark:bg-slate-950 border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
              {...register("aboutItem")}
            />
            {errors.aboutItem && <span className="text-red-500">{errors.aboutItem.message}</span>}
          </div>

          <div>
            <Button type="submit">Submit</Button>
          </div>
        </div>

        {/* Right column: images per color */}
        <div className="space-y-4">
          <div className="border rounded-md p-4 dark:border-gray-700">
            <Label className="block text-sm font-medium text-gray-700 dark:text-white">
              Product Images (per color)
            </Label>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Upload at least one image for each selected color.
            </p>
            {selectedColors.length === 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                Please add colors on the left to enable image uploads.
              </p>
            )}
            {selectedColors.length > 0 && (
              <div className="mt-3 grid grid-cols-1 gap-4">
                {selectedColors.map((color, colorIndex) => {
                  // Get current images for this color from product data
                  const currentImages = action === "update" && product?.images && Array.isArray(product.images)
                    ? product.images.filter((_: string, idx: number) => {
                        // Map images to colors by index (assuming images are ordered by color)
                        const imagesPerColor = Math.ceil(product.images.length / selectedColors.length);
                        return idx >= colorIndex * imagesPerColor && idx < (colorIndex + 1) * imagesPerColor;
                      })
                    : [];

                  return (
                    <div key={color} className="border rounded-md p-3 dark:border-gray-700">
                      <p className="text-sm font-medium mb-1 capitalize">{color} Images</p>
                      
                      {/* Show current images if in update mode */}
                      {action === "update" && currentImages.length > 0 && (
                        <div className="mb-3">
                          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Current Images:</p>
                          <div className="flex flex-wrap gap-2">
                            {currentImages.map((img: string, idx: number) => (
                              <div key={idx} className="relative">
                                <img
                                  src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${img}`}
                                  alt={`${color} ${idx + 1}`}
                                  className="h-20 w-20 object-cover rounded border dark:border-gray-600"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <Input
                        id={`images-${color}`}
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => handleImagesChange(color, e.target.files)}
                        className="mt-1 p-2 block w-full rounded-md border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
                      />
                      {imagesRecord?.[color]?.length ? (
                        <p className="text-xs mt-1 text-green-600">{imagesRecord[color].length} file(s) selected</p>
                      ) : (
                        <p className="text-xs mt-1 text-gray-400">No files selected</p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            {errors.images && <span className="text-red-500">{(errors.images as any).message}</span>}
          </div>
        </div>
      </form>
    </div>
  );
};


export default ProductForm;