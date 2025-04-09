import { z } from "zod";

class CartItem {
    id: string;
    name: string;
    cents: bigint;
    quantity: bigint;
    imgURL: URL;

    /**
     * @constructor
     * @param name The name of the item
     * @param priceCents The price of the item in cents
     * @param quantity How many items purchased
     * @param imgURL The image URL of the item
     */
    constructor(
        name: string,
        priceCents: bigint,
        quantity: bigint,
        imgURL: URL,
        id = crypto.randomUUID()
    ) {
        z.bigint().nonnegative().parse(priceCents);
        z.bigint().nonnegative().parse(quantity);

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
    price(toString: boolean = false): bigint | string {
        if (!toString) {
            return this.cents;
        }

        return (this.cents / 100n).toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
        });
    }

    /**
     * Calculates the total price of the cart item
     * @param toString Whether to return the total price as a bigint in cents or a formatted USD currency string
     * @returns The total price in cents or a formatted string
     */
    total(toString: boolean = false): bigint | string {
        const totalPrice = this.quantity * (this.price(false) as bigint);
        if (!toString) {
            return totalPrice;
        }

        return (totalPrice / 100n).toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
        });
    }
}

export { CartItem };
