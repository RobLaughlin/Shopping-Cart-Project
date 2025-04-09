import { z } from "zod";

class CartItem {
    id: string | number;
    name: string;
    cents: number;
    quantity: number;
    imgURL: URL;

    /**
     * @constructor
     * @param name The name of the item
     * @param priceCents The price of the item in cents
     * @param quantity How many items purchased
     * @param imgURL The image URL of the item
     * @param id The unique ID of the item
     */
    constructor(
        name: string,
        priceCents: number,
        quantity: number,
        imgURL: URL,
        id: string | number = crypto.randomUUID()
    ) {
        z.number().int().nonnegative().parse(priceCents);
        z.number().int().nonnegative().parse(quantity);
        z.string()
            .url()
            .refine(
                (url) => {
                    const validImageFormats = [".png", ".jpg", ".jpeg", ".gif"];
                    if (url.length < 4) {
                        return false;
                    }

                    return validImageFormats.some((fmt) => url.endsWith(fmt));
                },
                {
                    message: "Invalid image format",
                }
            )
            .parse(imgURL.href);

        this.name = name;
        this.cents = priceCents;
        this.quantity = quantity;
        this.imgURL = imgURL;
        this.id = id;
    }

    /**
     * Calculates the price of the single cart item
     * @param toString Whether to return the item price as a bigint in cents or a formatted USD currency string
     * @returns The item price in cents or a formatted string
     */
    price(toString: boolean = false): number | string {
        if (!toString) {
            return this.cents;
        }

        return (Number(this.cents) / 100).toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
        });
    }

    /**
     * Calculates the total price of the cart item
     * @param toString Whether to return the total price as a bigint in cents or a formatted USD currency string
     * @returns The total price in cents or a formatted string
     */
    total(toString: boolean = false): number | string {
        const totalPrice = this.quantity * (this.price(false) as number);
        if (!toString) {
            return totalPrice;
        }

        return (totalPrice / 100).toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
        });
    }
}

export { CartItem };
