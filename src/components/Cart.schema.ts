import { z } from "zod";

const VALID_IMAGE_FORMATS = [".png", ".jpg", ".jpeg", ".gif"];

class CartItem {
    id: string | number;
    name: string;
    cents: number;
    remainingItems: number;
    imgURL: URL;

    #quantity: number;

    /**
     * @constructor
     * @param name The name of the item
     * @param priceCents The price of the item in cents
     * @param quantity How many items purchased
     * @param remainingItems How many of these items are left in the store
     * @param imgURL The image URL of the item
     * @param id The unique ID of the item
     */
    constructor(
        name: string,
        priceCents: number,
        quantity: number,
        remainingItems: number,
        imgURL: URL,
        id: string | number = crypto.randomUUID()
    ) {
        z.number().int().nonnegative().parse(priceCents);
        z.number().int().positive().parse(remainingItems);
        z.number().int().positive().lte(remainingItems).parse(quantity);

        z.string()
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
            )
            .parse(imgURL.href);

        this.name = name;
        this.cents = priceCents;
        this.remainingItems = remainingItems;
        this.imgURL = imgURL;
        this.id = id;

        this.#quantity = Math.min(quantity, remainingItems);
    }

    get quantity() {
        return this.#quantity;
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

    /**
     * Updates the quantity of this specific item to purchase.
     * Cannot exceed the remaining number of items.
     *
     * @param quantity The new quantity of the item in the cart
     */
    updateQuantity(quantity: number): void {
        z.number().int().nonnegative().parse(quantity);
        this.#quantity = Math.max(1, Math.min(quantity, this.remainingItems));
    }
}

export { CartItem };
