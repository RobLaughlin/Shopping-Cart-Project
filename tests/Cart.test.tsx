import { describe, it, expect } from "vitest";
import { within } from "@testing-library/react";
import { render, screen } from "@testing-library/react";
import { ProductItemWithStock } from "../src/Schemas/ProductItem.schema";
import userEvent from "@testing-library/user-event";
import { cloneDeep } from "lodash-es";
import Cart from "../src/components/Cart/Cart.component";
import React from "react";
import { date } from "zod";
import { TEST_PRODUCT_ITEMS } from "./Testdata";
import { BrowserRouter } from "react-router-dom";

describe("Cart component", () => {
    const testItems = cloneDeep(TEST_PRODUCT_ITEMS);

    interface ItemData {
        id: string | number;
        quantityElem: HTMLElement | null;
        costElems: HTMLElement[];
        totalCostElems: HTMLElement[];
        stockElem: HTMLElement | null;
        increaseQuantityElem: HTMLElement | null;
        decreaseQuantityElem: HTMLElement | null;
        ratings: {
            rateElem: HTMLElement | null;
            countElem: HTMLElement | null;
        };
    }

    interface CartQueries {
        emptyText: HTMLElement | null;
        formattedTotalCost: HTMLElement[];
        itemData: (ItemData | null)[];
    }

    function renderCart(
        items: ProductItemWithStock[],
        rerender = true
    ): CartQueries {
        if (rerender) {
            render(
                <BrowserRouter>
                    <Cart items={items} />
                </BrowserRouter>
            );
        }

        const queryEmptyText = (): HTMLElement | null => {
            return screen.queryByText(/empty/i);
        };

        const queryFormattedTotalCost = (
            items: ProductItemWithStock[]
        ): HTMLElement[] => {
            const cost = items.reduce((acc, item) => {
                return acc + item.price * item.quantity;
            }, 0);
            const costStr = cost.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
            });

            return screen.queryAllByText(costStr);
        };

        const queryItems = (
            items: ProductItemWithStock[]
        ): (ItemData | null)[] => {
            const itemData = items.map((item) => {
                const data: ItemData = {
                    id: item.id,
                    quantityElem: null,
                    costElems: [],
                    totalCostElems: [],
                    stockElem: null,
                    increaseQuantityElem: null,
                    decreaseQuantityElem: null,
                    ratings: {
                        rateElem: null,
                        countElem: null,
                    },
                };

                const itemElem = screen.queryByTestId(item.id);
                if (itemElem === null) {
                    return null;
                }

                // Grab quantity buttons
                data.increaseQuantityElem =
                    within(itemElem).queryByTestId("IncreaseQuantity");
                data.decreaseQuantityElem =
                    within(itemElem).queryByTestId("DecreaseQuantity");

                // Update quantity if possible
                const quantityLabel = within(itemElem).queryByText(/quantity/i);
                if (quantityLabel !== null) {
                    const quantity = within(quantityLabel).queryByText(
                        item.quantity.toString()
                    );

                    data.quantityElem = quantity;
                }

                // Query cost and totalCost if possible
                data.costElems = within(itemElem).queryAllByText(
                    item.price.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                    })
                );
                data.totalCostElems = within(itemElem).queryAllByText(
                    (item.price * item.quantity).toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                    })
                );

                // Query remaining items
                if (item.stock === 0) {
                    data.stockElem =
                        within(itemElem).queryByText(/out of stock/i);
                } else {
                    const stock = within(itemElem).queryByText(/in stock/i);
                    if (stock !== null) {
                        data.stockElem = within(stock).queryByText(
                            item.stock.toString()
                        );
                    }
                }

                data.ratings.rateElem =
                    within(itemElem).queryByTestId("ratings");

                const ratingsContainer =
                    within(itemElem).queryByTestId("ratingsContainer");
                if (ratingsContainer !== null) {
                    data.ratings.countElem = within(
                        ratingsContainer
                    ).queryByText(item.rating.count);
                }
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
        const { itemData } = renderCart(testItems);

        itemData.forEach((item) => {
            expect(item).not.toBe(null);
            if (item === null) {
                return;
            }

            const { quantityElem, costElems, totalCostElems } = item;
            expect(quantityElem).not.toBe(null);
            expect(costElems).not.toStrictEqual([]);
            expect(totalCostElems).not.toStrictEqual([]);
        });
    });

    it("Renders the formatted total accumulated cost of all items", () => {
        const { formattedTotalCost } = renderCart(testItems);
        expect(formattedTotalCost).not.toStrictEqual([]);
    });

    it("Renders the correct quantities, costs, and total costs after user increases or decreases the quantity", async () => {
        function getItemDataFromScreen(
            items: ProductItemWithStock[],
            id: number | string,
            rerender: boolean
        ): ItemData | null {
            const { itemData } = renderCart(items, rerender);

            const item = itemData.find(
                (item) => item !== null && id === item.id
            );
            if (item === null || item === undefined) {
                return null;
            }

            return item;
        }

        const user = userEvent.setup();
        const items = cloneDeep(testItems);

        renderCart(items);
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const prevItemData = getItemDataFromScreen(items, item.id, false);

            expect(prevItemData).not.toBe(null);
            if (prevItemData === null) {
                break;
            }

            const { quantityElem, increaseQuantityElem, decreaseQuantityElem } =
                prevItemData;

            expect(quantityElem).not.toBe(null);
            expect(increaseQuantityElem).not.toBe(null);
            expect(decreaseQuantityElem).not.toBe(null);
            if (
                quantityElem === null ||
                increaseQuantityElem === null ||
                decreaseQuantityElem === null
            ) {
                break;
            }

            await user.click(increaseQuantityElem);

            const increaseItems = cloneDeep(items);
            increaseItems[i].quantity++;

            const increasedItemData = getItemDataFromScreen(
                increaseItems,
                item.id,
                false
            );
            expect(increasedItemData).not.toBe(null);

            const decreaseItems = cloneDeep(increaseItems);
            decreaseItems[i].quantity--;
            const decreasedItemData = getItemDataFromScreen(
                decreaseItems,
                item.id,
                false
            );
            expect(decreasedItemData).not.toBe(null);
        }
    });

    it("Shows how many items are remaining and out of stock if that number is 0", () => {
        const { itemData } = renderCart(testItems);
        itemData.forEach((item) => {
            expect(item).not.toBe(null);
            if (item === null) {
                return;
            }

            const { stockElem } = item;
            expect(stockElem).not.toBe(null);
        });
    });

    it("Removes the item when the remove item button is clicked", async () => {
        const user = userEvent.setup();
        const { itemData } = renderCart(testItems);

        for (let i = 0; i < itemData.length; i++) {
            const item = itemData[i];
            expect(item).not.toBe(null);
            if (item === null) {
                return;
            }

            const itemElem = screen.queryByTestId(item.id.toString());
            expect(itemElem).not.toBe(null);
            if (itemElem === null) {
                return;
            }

            const removeItemBtn = within(itemElem).queryByTestId("RemoveItem");
            expect(removeItemBtn).not.toBe(null);
            if (removeItemBtn === null) {
                return;
            }

            await user.click(removeItemBtn);

            // Verify that the item was removed
            expect(screen.queryByTestId(item.id.toString())).toBe(null);
        }
    });

    it("Displays the ratings and how many reviews there are, rounded to the nearest 0.5", () => {
        const { itemData } = renderCart(testItems);
        itemData.forEach((item) => {
            expect(item).not.toBe(null);
            if (item === null) {
                return;
            }

            const { ratings } = item;
            const { rateElem, countElem } = ratings;

            expect(rateElem).not.toBe(null);
            expect(countElem).not.toBe(null);
        });
    });
});
