import ProductList from "../ProductList/ProductList.component";
import { ProductItemWithStock } from "../../Schemas/ProductItem.schema";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import { SyntheticEvent, useEffect, useState } from "react";
import TextField from "@mui/material/TextField";

import { IconButton } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCartOutlined";
import Badge from "@mui/material/Badge";

import styles from "./ProductPage.module.css";

type ProductPageProps = {
    items: ProductItemWithStock[];
    itemsInCart?: number;
    onAddToCartBtnClicked?: (item: ProductItemWithStock) => void;
    onCartBtnClicked?: () => void;
};

function ProductPage({
    items,
    itemsInCart = 0,
    onAddToCartBtnClicked = (item) => {
        item;
    },
    onCartBtnClicked = () => {},
}: ProductPageProps) {
    const [categories, setCategories] = useState(new Map<string, boolean>());
    const [searchText, setSearchText] = useState("");

    useEffect(() => {
        const categoryMap = new Map<string, boolean>();
        items.forEach((item) => {
            categoryMap.set(item.category, false);
        });
        setCategories(categoryMap);
    }, [items]);

    function uppercaseWords(str: string): string {
        const words = str.split(" ");
        for (let i = 0; i < words.length; i++) {
            const word = words[i];
            if (word.length > 0) {
                words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
            }
        }
        return words.join(" ");
    }

    function checkboxClicked(category: string, checked: boolean): void {
        categories.set(category, checked);
        setCategories(new Map(categories));
    }

    function filterProductsByCategory(
        items: ProductItemWithStock[],
        categories: Map<string, boolean>
    ): ProductItemWithStock[] {
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

    function filterProductsBySearch(
        items: ProductItemWithStock[],
        searchText: string
    ): ProductItemWithStock[] {
        // Return all items if the search bar is empty
        if (searchText === "") {
            return items;
        }

        return items.filter((item) => {
            const searchableFields = [
                item.title.toLowerCase(),
                item.description.toLowerCase(),
                item.category.toLowerCase(),
            ];

            // Search word by word for a more robust search
            return searchableFields.some((field) => {
                const words = searchText.split(" ");
                return words.some((word) => field.includes(word.toLowerCase()));
            });
        });
    }

    function searchInputChanged(e: any): void {
        setSearchText(e.target.value);
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
                                                data-category={category}
                                                data-testid={category}
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
            <main>
                <div className={styles.productListContainer}>
                    <div className={styles.productListHeader}>
                        <TextField
                            id="standard-basic"
                            label="Search products"
                            variant="standard"
                            color="primary"
                            fullWidth={true}
                            value={searchText}
                            onChange={searchInputChanged}
                        />
                        <IconButton
                            className={styles.cartBtn}
                            onClick={onCartBtnClicked}
                        >
                            <ShoppingCartIcon fontSize="large" />
                            <Badge
                                badgeContent={itemsInCart}
                                color="primary"
                                overlap="circular"
                                className={styles.cartBadge}
                            />
                        </IconButton>
                    </div>
                    <ProductList
                        items={Array.from(
                            filterProductsBySearch(
                                filterProductsByCategory(items, categories),
                                searchText
                            )
                        )}
                        styleOverrides={styles}
                        addToCartHandler={onAddToCartBtnClicked}
                    />
                </div>
            </main>
        </div>
    );
}

export default ProductPage;
