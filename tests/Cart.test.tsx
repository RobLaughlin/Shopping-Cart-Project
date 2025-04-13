import { describe, it, expect } from "vitest";
import { within } from "@testing-library/react";
import { render, screen } from "@testing-library/react";
import { CartItem } from "../src/components/Cart.schema";
import userEvent from "@testing-library/user-event";
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

describe("Cart component", () => {
    const cartItems = [
        new CartItem(
            "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
            10995,
            3,
            5,
            new URL("https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg"),
            1
        ),
        new CartItem(
            "Mens Casual Premium Slim Fit T-Shirts",
            2230,
            6,
            100,
            new URL(
                "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg"
            ),
            2
        ),
        new CartItem(
            "Silicon Power 256GB SSD 3D NAND A55 SLC Cache Performance Boost SATA III 2.5",
            10900,
            1,
            20,
            new URL("https://fakestoreapi.com/img/71kWymZ+c+L._AC_SX679_.jpg"),
            11
        ),
    ];

    interface ItemData {
        quantity: HTMLElement | null;
        cost: HTMLElement[];
        totalCost: HTMLElement[];
    }

    interface CartQueries {
        emptyText: HTMLElement | null;
        formattedTotalCost: HTMLElement[];
        itemData: (ItemData | null)[];
    }

    function renderCart(items: CartItem[]): CartQueries {
        render(<Cart items={items} />);

        const queryEmptyText = (): HTMLElement | null => {
            return screen.queryByText(/empty/i);
        };

        const queryFormattedTotalCost = (items: CartItem[]): HTMLElement[] => {
            const cost = items.reduce((acc, item) => {
                return acc + (item.total(false) as number);
            }, 0);
            const costStr = (cost / 100).toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
            });

            return screen.queryAllByText(costStr);
        };

        const queryItems = (items: CartItem[]): (ItemData | null)[] => {
            const itemData = items.map((item) => {
                const data: ItemData = {
                    quantity: null,
                    cost: [],
                    totalCost: [],
                };

                const itemElem = screen.queryByTestId(item.id);
                if (itemElem === null) {
                    return null;
                }

                // Update quantity if possible
                const quantityLabel = within(itemElem).queryByText(/quantity/i);
                if (quantityLabel !== null) {
                    const quantity = within(quantityLabel).queryByText(
                        item.quantity.toString()
                    );

                    data.quantity = quantity;
                }

                // Update cost and totalCost if possible
                data.cost = within(itemElem).queryAllByText(item.price(true));
                data.totalCost = within(itemElem).queryAllByText(
                    item.total(true)
                );
                return data;
            });

            return itemData;
        };

        const queries: CartQueries = {
            emptyText: queryEmptyText(),
            formattedTotalCost: queryFormattedTotalCost(items),
            itemData: queryItems(items),
        };

        return queries;
    }

    it("Renders text to the user if there are no items in the cart", () => {
        const { emptyText } = renderCart([]);
        expect(emptyText).not.toBe(null);
    });

    it("Renders the quantity, formatted price, and total cost (price * quantity) of each item", () => {
        const { itemData } = renderCart(cartItems);

        itemData.forEach((item) => {
            expect(item).not.toBe(null);
            if (item === null) {
                return;
            }

            const { quantity, cost, totalCost } = item;
            expect(quantity).not.toBe(null);
            expect(cost).not.toStrictEqual([]);
            expect(totalCost).not.toStrictEqual([]);
        });
    });

    it("Renders the formatted total accumulated cost of all items", () => {
        const { formattedTotalCost } = renderCart(cartItems);
        expect(formattedTotalCost).not.toStrictEqual([]);
    });
});
