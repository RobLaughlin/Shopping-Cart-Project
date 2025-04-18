import { describe, it, expect } from "vitest";
import { within } from "@testing-library/react";
import { render, screen } from "@testing-library/react";
import {
    ProductItem,
    ProductItemWithStock,
} from "../src/Schemas/ProductItem.schema";
import userEvent from "@testing-library/user-event";
import { cloneDeep } from "lodash-es";
import ProductList from "../src/components/ProductList/ProductList.component";
import React from "react";
import { TEST_PRODUCT_ITEMS } from "./Testdata";

describe("ProductList component", () => {
    const testItems = cloneDeep(TEST_PRODUCT_ITEMS);

    type Item = {
        item: ProductItemWithStock;
        itemElem: HTMLElement | null;
    };

    function getItems() {
        render(<ProductList items={testItems} />);
        const items: Item[] = testItems.map((item: ProductItemWithStock) => {
            return {
                item: item,
                itemElem: screen.queryByTestId(item.id),
            };
        });

        return items;
    }

    it("Displays each item's title, rating, and price", () => {
        const items = getItems();
        items.forEach(({ item, itemElem }) => {
            const elem = itemElem as HTMLElement;
            expect(() => {
                expect(elem).not.toBe(null);
                within(elem).getAllByText(item.title);
                within(elem).getByTestId("ratings");

                const formattedPrice = item.price.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                });
                within(elem).getAllByText(formattedPrice);
            }).not.toThrowError();
        });
    });

    it("Displays each item's number left in stock, and 'out of stock' if that number is 0", () => {
        const items = getItems();
        items.forEach(({ item, itemElem }) => {
            const elem = itemElem as HTMLElement;
            expect(() => {
                expect(elem).not.toBe(null);

                if (item.stock > 0) {
                    const inStockContainer = within(elem).getByText(
                        /in stock/i
                    ) as HTMLElement;
                    expect(inStockContainer).not.toBe(null);
                    within(inStockContainer).getByText(item.stock.toString());
                } else {
                    within(elem).getByText(/out of stock/i);
                }
            }).not.toThrowError();
        });
    });
});
