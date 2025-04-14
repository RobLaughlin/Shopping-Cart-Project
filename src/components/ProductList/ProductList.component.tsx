import { useState } from "react";

import styles from "./ProductList.module.css";
import { ProductItem } from "../../Schemas/ProductItem.schema";

import Button from "@mui/material/Button";

type ProductListProps = {
    items?: ProductItem[];
};

function ProductList({ items = [] }: ProductListProps) {
    const [ProductItems, setProductItems] = useState([
        ...items.map((itm) => {
            return new ProductItem(
                itm.name,
                itm.price(false) as number,
                itm.quantity,
                itm.remainingItems,
                itm.imgURL,
                itm.id
            );
        }),
    ]);

    function renderItems(items: ProductItem[]) {
        return (
            <>
                <ul className={styles["no-list-style"]}>
                    {items.map((item) => {
                        const { id, name, remainingItems, imgURL } = item;
                        const price = item.price(true);
                        const total = item.total(true);

                        return (
                            <li
                                key={id}
                                className={styles.productItem}
                                data-testid={id}
                            >
                                <div className={styles.card}>
                                    <img
                                        src={imgURL.href}
                                        alt="Item thumbnail"
                                        className={styles.thumbnail}
                                    />
                                    <hr />
                                    <div className={styles.infoContainer}>
                                        <h1 className={styles.itemName}>
                                            {name}
                                        </h1>
                                        <hr />
                                        <p className={styles.price}>
                                            Price: <b>{price}</b>
                                        </p>
                                        <p className={styles.itemsRemaining}>
                                            {remainingItems !== 0 ? (
                                                <>
                                                    Items remaining:{" "}
                                                    <b>{item.remainingItems}</b>
                                                </>
                                            ) : (
                                                <b
                                                    className={
                                                        styles.outOfStock
                                                    }
                                                >
                                                    OUT OF STOCK
                                                </b>
                                            )}
                                        </p>
                                        <div className={styles.itemFooter}>
                                            <Button
                                                variant="contained"
                                                className={styles.checkoutBtn}
                                                size="large"
                                            >
                                                Add to Cart
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
                <hr />
                <div className={styles.viewCartContainer}>
                    <Button
                        variant="contained"
                        className={styles.viewCartBtn}
                        size="large"
                    >
                        View Cart
                    </Button>
                </div>
            </>
        );
    }

    return (
        <div className={styles.products}>
            {ProductItems.length > 0 ? (
                renderItems(ProductItems)
            ) : (
                <p>No products found...</p>
            )}
        </div>
    );
}

export default ProductList;
