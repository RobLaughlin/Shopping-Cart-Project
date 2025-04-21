import ProductList from "../ProductList/ProductList.component";
import { ProductItemWithStock } from "../../Schemas/ProductItem.schema";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

import styles from "./ProductPage.module.css";

type ProductPageProps = {
    items: ProductItemWithStock[];
};

function ProductPage({ items }: ProductPageProps) {
    function categories(items: ProductItemWithStock[]): string[] {
        // Reduce to categories
        const data = [
            ...items.reduce((acc: Set<string>, item: ProductItemWithStock) => {
                acc.add(item.category);
                return acc;
            }, new Set<string>()),
        ];

        // Uppercase the first letter of each word
        return data.map((category) => {
            const words = category.split(" ");
            for (let i = 0; i < words.length; i++) {
                const word = words[i];
                if (word.length > 0) {
                    words[i] =
                        words[i].charAt(0).toUpperCase() + words[i].slice(1);
                }
            }
            return words.join(" ");
        });
    }

    return (
        <div className={styles.productPage}>
            <div className={styles.sidebarContainer}>
                <h1 className={styles.sidebarHeader}>Categories</h1>
                <ul className={styles.sidebar}>
                    {categories(items).map((category) => {
                        return (
                            <li className={styles.sidebarItem} key={category}>
                                <FormControlLabel
                                    control={<Checkbox />}
                                    label={category}
                                />
                            </li>
                        );
                    })}
                </ul>
            </div>

            <ProductList items={items} styleOverrides={styles} />
        </div>
    );
}

export default ProductPage;
