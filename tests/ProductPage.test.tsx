import { describe, it, expect } from "vitest";
import { within } from "@testing-library/react";
import { render, screen } from "@testing-library/react";
import ProductPage from "../src/components/ProductPage/ProductPage.component";
import { TEST_PRODUCT_ITEMS } from "./Testdata";
import userEvent from "@testing-library/user-event";
import React from "react";
import { cloneDeep } from "lodash-es";

describe("Product Page Sidebar Tests", () => {
    it("Filters products based on category. Displays all products when no categories are selected", () => {
        const user = userEvent.setup();
        render(<ProductPage items={TEST_PRODUCT_ITEMS} />);

        expect(async () => {
            const categories = TEST_PRODUCT_ITEMS.map((item) => item.category);
            const checkboxes = categories.map((category) =>
                screen.getByTestId(category)
            );

            for (let i = 0; i < checkboxes.length; i++) {
                const checkbox = checkboxes[i];
                await user.click(checkbox);

                const checkedProducts = cloneDeep(TEST_PRODUCT_ITEMS).filter(
                    (item) => item.category === checkbox.dataset.category
                );
                const uncheckedProducts = cloneDeep(TEST_PRODUCT_ITEMS).filter(
                    (item) => item.category !== checkbox.dataset.category
                );

                checkedProducts.forEach((product) => {
                    within(screen.getByTestId(product.id)).getAllByText(
                        product.category
                    );
                });

                uncheckedProducts.forEach((product) => {
                    expect(() => {
                        within(screen.getByTestId(product.id)).getAllByText(
                            product.category
                        );
                    }).toThrowError();
                });

                await user.click(checkbox);
            }
        }).not.toThrowError();
    });
});
