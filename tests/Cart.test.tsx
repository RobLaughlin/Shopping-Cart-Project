import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { CartItem } from "../src/components/Cart.schema";
import Cart from "../src/components/Cart.component";
import React from "react";

describe("CartItem data structure", () => {
    const img = new URL("http://localhost/test.png");

    it("Only accepts non-negative integer prices", () => {
        expect(() => {
            new CartItem("name", 0.5, 2, 5, img);
        }).toThrowError();

        expect(() => {
            new CartItem("name", -1, 2, 5, img);
        }).toThrowError();

        expect(() => {
            new CartItem("name", 0, 2, 5, img);
        }).not.toThrowError();

        expect(() => {
            new CartItem("name", 1, 2, 5, img);
        }).not.toThrowError();
    });

    it("Only accepts positive integer quantities", () => {
        expect(() => {
            new CartItem("name", 1, 0.5, 5, img);
        }).toThrowError();

        expect(() => {
            new CartItem("name", 1, -1, 5, img);
        }).toThrowError();

        expect(() => {
            new CartItem("name", 1, 0, 5, img);
        }).toThrowError();

        expect(() => {
            new CartItem("name", 1, 1, 5, img);
        }).not.toThrowError();
    });

    it("Only accepts positive integer remaining items", () => {
        expect(() => {
            new CartItem("name", 1, 1, -1, img);
        }).toThrowError();

        expect(() => {
            new CartItem("name", 1, 1, 0.5, img);
        }).toThrowError();

        expect(() => {
            new CartItem("name", 1, 1, 0, img);
        }).toThrowError();

        expect(() => {
            new CartItem("name", 1, 1, 1, img);
        }).not.toThrowError();
    });

    it("Cannot set a quantity initially above the number of remaining items", () => {
        expect(() => {
            new CartItem("name", 1, 6, 5, img);
        }).toThrowError();

        expect(() => {
            new CartItem("name", 1, 5, 5, img);
        }).not.toThrowError();

        expect(() => {
            new CartItem("name", 1, 4, 5, img);
        }).not.toThrowError();
    });

    it("Clamps quantities between [1, remainingItems]", () => {
        function updateQuantity(initQuantity, newQuantity, remainingItems) {
            const item = new CartItem(
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
        expect(updateQuantity(3, 0, 5)).toBe(1);

        expect(() => {
            updateQuantity(3, -1, 5);
        }).toThrowError();

        expect(() => {
            updateQuantity(3, 0.5, 5);
        }).toThrowError();
    });

    it("Accurately computes and formats prices", () => {
        const item = new CartItem("name", 1235, 5, 10, img);
        expect(item.price()).toBe(1235);
        expect(item.price(true)).toBe("$12.35");

        item.cents = 0;
        expect(item.price(true)).toBe("$0.00");

        item.cents = 4;
        expect(item.price(true)).toBe("$0.04");
    });

    it("Accurately computes and formats totals", () => {
        const item = new CartItem("name", 1235, 5, 10, img);
        expect(item.total()).toBe(6175);
        expect(item.total(true)).toBe("$61.75");

        item.cents = 0;
        expect(item.total(true)).toBe("$0.00");

        item.cents = 4;
        expect(item.total(true)).toBe("$0.20");
    });
});
