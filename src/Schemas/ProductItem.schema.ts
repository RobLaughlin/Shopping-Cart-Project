import { z } from "zod";

const VALID_IMAGE_FORMATS = [".png", ".jpg", ".jpeg", ".gif"];
const PRODUCT_ITEM_SCHEMA = z
    .object({
        id: z.string().or(z.number()),
        title: z.string(),
        price: z.number().nonnegative(),
        image: z
            .string()
            .url()
            .refine(
                (url) => {
                    if (url.length < 4) {
                        return false;
                    }

                    return VALID_IMAGE_FORMATS.some((fmt) => url.endsWith(fmt));
                },
                {
                    message: "Invalid image format",
                }
            ),
        category: z.string(),
        description: z.string(),
        rating: z
            .object({
                rate: z.number().nonnegative().lte(5),
                count: z.number().int().nonnegative(),
            })
            .required(),
    })
    .required();

const PRODUCT_ITEM_WITH_STOCK_SCHEMA = PRODUCT_ITEM_SCHEMA.extend({
    stock: z.number().int().nonnegative(),
    quantity: z.number().int().nonnegative(),
}).refine((item) => {
    return item.quantity <= item.stock;
});

type ProductItem = z.infer<typeof PRODUCT_ITEM_SCHEMA>;
type ProductItemWithStock = z.infer<typeof PRODUCT_ITEM_WITH_STOCK_SCHEMA>;

export type { ProductItem, ProductItemWithStock };
export { PRODUCT_ITEM_SCHEMA, PRODUCT_ITEM_WITH_STOCK_SCHEMA };
