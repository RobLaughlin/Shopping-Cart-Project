import { describe, it, expect } from "vitest";
import { ProductItem } from "../src/Schemas/ProductItem.schema";

describe("ProductItem data structure", () => {
    const img = new URL("http://localhost/test.png");

    it("Only accepts non-negative integer prices", () => {
        expect(() => {
            new ProductItem("name", 0.5, 2, 5, img);
        }).toThrowError();

        expect(() => {
            new ProductItem("name", -1, 2, 5, img);
        }).toThrowError();

        expect(() => {
            new ProductItem("name", 0, 2, 5, img);
        }).not.toThrowError();

        expect(() => {
            new ProductItem("name", 1, 2, 5, img);
        }).not.toThrowError();
    });

    it("Only accepts non-negative integer quantities", () => {
        expect(() => {
            new ProductItem("name", 1, 0.5, 5, img);
        }).toThrowError();

        expect(() => {
            new ProductItem("name", 1, -1, 5, img);
        }).toThrowError();

        expect(() => {
            new ProductItem("name", 1, 0, 5, img);
        }).not.toThrowError();

        expect(() => {
            new ProductItem("name", 1, 1, 5, img);
        }).not.toThrowError();
    });

    it("Only accepts non-negative integer remaining items", () => {
        expect(() => {
            new ProductItem("name", 1, 1, -1, img);
        }).toThrowError();

        expect(() => {
            new ProductItem("name", 1, 1, 0.5, img);
        }).toThrowError();

        expect(() => {
            new ProductItem("name", 1, 0, 0, img);
        }).not.toThrowError();

        expect(() => {
            new ProductItem("name", 1, 1, 1, img);
        }).not.toThrowError();
    });

    it("Cannot set a quantity initially above the number of remaining items", () => {
        expect(() => {
            new ProductItem("name", 1, 6, 5, img);
        }).toThrowError();

        expect(() => {
            new ProductItem("name", 1, 5, 5, img);
        }).not.toThrowError();

        expect(() => {
            new ProductItem("name", 1, 4, 5, img);
        }).not.toThrowError();
    });

    it("Clamps quantities between [0, remainingItems]", () => {
        function updateQuantity(
            initQuantity: number,
            newQuantity: number,
            remainingItems: number
        ) {
            const item = new ProductItem(
                "name",
                1,
                initQuantity,
                remainingItems,
                img
            );
            item.updateQuantity(newQuantity);
            return item.quantity;
        }

        expect(updateQuantity(3, 6, 5)).toBe(5);
        expect(updateQuantity(3, 5, 5)).toBe(5);
        expect(updateQuantity(3, 4, 5)).toBe(4);
        expect(updateQuantity(3, 0, 5)).toBe(0);
        expect(updateQuantity(3, -1, 5)).toBe(0);

        expect(() => {
            updateQuantity(3, 0.5, 5);
        }).toThrowError();
    });

    it("Accurately computes and formats prices", () => {
        const item = new ProductItem("name", 1235, 5, 10, img);
        expect(item.price()).toBe(1235);
        expect(item.price(true)).toBe("$12.35");

        item.cents = 0;
        expect(item.price(true)).toBe("$0.00");

        item.cents = 4;
        expect(item.price(true)).toBe("$0.04");
    });

    it("Accurately computes and formats totals", () => {
        const item = new ProductItem("name", 1235, 5, 10, img);
        expect(item.total()).toBe(6175);
        expect(item.total(true)).toBe("$61.75");

        item.cents = 0;
        expect(item.total(true)).toBe("$0.00");

        item.cents = 4;
        expect(item.total(true)).toBe("$0.20");
    });
});
