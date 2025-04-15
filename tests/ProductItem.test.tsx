import { describe, it, expect } from "vitest";
import {
    ProductItemWithStock,
    PRODUCT_ITEM_WITH_STOCK_SCHEMA,
} from "../src/Schemas/ProductItem.schema";
import { cloneDeep } from "lodash-es";

describe("ProductItem data structure", () => {
    const testItem: ProductItemWithStock = {
        id: 1,
        title: "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
        price: 109.95,
        description:
            "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
        category: "men's clothing",
        image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
        rating: {
            rate: 3.9,
            count: 120,
        },
        stock: 10,
        quantity: 0,
    };

    type Test = {
        mod: object;
        toThrowError: boolean;
    };

    // Given an array of modifications to the test item and an expected result
    function runModificationTests(
        itemToTest: ProductItemWithStock,
        tests: Test[]
    ) {
        tests.forEach(({ mod, toThrowError }) => {
            const item = cloneDeep(itemToTest);
            for (const key in mod) {
                item[key] = mod[key];
            }

            const test = expect(() => {
                PRODUCT_ITEM_WITH_STOCK_SCHEMA.parse(item);
            });
            toThrowError ? test.toThrowError() : test.not.toThrowError();
        });
    }

    it("Only accepts non-negative prices", () => {
        const tests: Test[] = [
            { mod: { price: -0.5 }, toThrowError: true },
            { mod: { price: -1 }, toThrowError: true },
            { mod: { price: 0.5 }, toThrowError: false },
            { mod: { price: 0 }, toThrowError: false },
            { mod: { price: 1 }, toThrowError: false },
        ];

        runModificationTests(testItem, tests);
    });

    it("Only accepts non-negative integer quantities", () => {
        const tests: Test[] = [
            { mod: { quantity: -0.5 }, toThrowError: true },
            { mod: { quantity: -1 }, toThrowError: true },
            { mod: { quantity: 0.5 }, toThrowError: true },
            { mod: { quantity: 0 }, toThrowError: false },
            { mod: { quantity: 1 }, toThrowError: false },
        ];

        runModificationTests(testItem, tests);
    });

    it("Only accepts non-negative integer remaining items in stock", () => {
        const tests: Test[] = [
            { mod: { stock: -0.5 }, toThrowError: true },
            { mod: { stock: -1 }, toThrowError: true },
            { mod: { stock: 0.5 }, toThrowError: true },
            { mod: { stock: 0 }, toThrowError: false },
            { mod: { stock: 1 }, toThrowError: false },
        ];
        runModificationTests(testItem, tests);
    });

    it("Cannot set a quantity initially above the number of remaining items in stock", () => {
        const tests: Test[] = [
            { mod: { stock: 1, quantity: 2 }, toThrowError: true },
            { mod: { stock: 1, quantity: 1 }, toThrowError: false },
            { mod: { stock: 1, quantity: 0 }, toThrowError: false },
        ];
        runModificationTests(testItem, tests);
    });

    it("Cannot set an invalid URL", () => {
        const tests: Test[] = [
            { mod: { image: "" }, toThrowError: true },
            { mod: { image: "http" }, toThrowError: true },
            { mod: { image: "http://test.exe" }, toThrowError: true },
            { mod: { image: "https://test.exe" }, toThrowError: true },
            { mod: { image: "png" }, toThrowError: true },
            { mod: { image: ".png" }, toThrowError: true },
            { mod: { image: "/png" }, toThrowError: true },
            { mod: { image: "test.png" }, toThrowError: true },
            { mod: { image: "/test.png" }, toThrowError: true },
            { mod: { image: "https://test.png" }, toThrowError: false },
            { mod: { image: "https://www.test.png" }, toThrowError: false },
            { mod: { image: "http://test.png" }, toThrowError: false },
        ];
        runModificationTests(testItem, tests);
    });
});
