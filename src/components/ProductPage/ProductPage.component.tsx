import ProductList from "../ProductList/ProductList.component";
import { ProductItemWithStock } from "../../Schemas/ProductItem.schema";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

import styles from "./ProductPage.module.css";
import { SyntheticEvent, useState } from "react";

type ProductPageProps = {
    items: ProductItemWithStock[];
};

function ProductPage({ items }: ProductPageProps) {
    const [categories, setCategories] = useState(
        (() => {
            const categoryMap = new Map<string, boolean>();
            items.forEach((item) => {
                categoryMap.set(item.category, false);
            });
            return categoryMap;
        })()
    );

    function uppercaseWords(str: string) {
        const words = str.split(" ");
        for (let i = 0; i < words.length; i++) {
            const word = words[i];
            if (word.length > 0) {
                words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
            }
        }
        return words.join(" ");
    }

    function checkboxClicked(category: string, checked: boolean) {
        categories.set(category, checked);
        setCategories(new Map(categories));
    }

    function filterProductsByCategory(categories: Map<string, boolean>) {
        // If all checkboxes are unchecked, just list all products
        if (!Array.from(categories.values()).some((checked) => checked)) {
            return items;
        }

        // Otherwise, filter only by categories checked
        const filtered = items.filter((item) => {
            return (
                categories.has(item.category) && categories.get(item.category)
            );
        });
        return filtered;
    }

    return (
        <div className={styles.productPage}>
            <div className={styles.sidebarContainer}>
                <div className={styles.headerAndSidebar}>
                    <h1 className={styles.sidebarHeader}>Categories</h1>
                    <ul className={styles.sidebar}>
                        {[...categories.keys()].map((category) => {
                            return (
                                <li
                                    className={styles.sidebarItem}
                                    key={category}
                                >
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                dataset-category={category}
                                                checked={categories.get(
                                                    category
                                                )}
                                            />
                                        }
                                        label={uppercaseWords(category)}
                                        onChange={(e: SyntheticEvent) => {
                                            const target =
                                                e.target as HTMLInputElement;
                                            checkboxClicked(
                                                category,
                                                target.checked
                                            );
                                        }}
                                    />
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>

            <ProductList
                items={Array.from(filterProductsByCategory(categories))}
                styleOverrides={styles}
            />
        </div>
    );
}

export default ProductPage;
