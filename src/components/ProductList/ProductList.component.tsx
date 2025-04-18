import { useState } from "react";
import { cloneDeep } from "lodash-es";
import {
    ProductItemWithStock,
    PRODUCT_ITEM_WITH_STOCK_SCHEMA,
} from "../../Schemas/ProductItem.schema";

import Button from "@mui/material/Button";
import Rating from "@mui/material/Rating";
import styles from "./ProductList.module.css";

type ProductListProps = {
    items?: ProductItemWithStock[];
};

function ProductList({ items = [] }: ProductListProps) {
    const [productItems, setProductItems] = useState(
        cloneDeep(
            items.filter(
                (item) => PRODUCT_ITEM_WITH_STOCK_SCHEMA.safeParse(item).success
            )
        )
    );

    function renderItems(items: ProductItemWithStock[]) {
        return (
            <>
                <ul className={styles["no-list-style"]}>
                    {items.map((item) => {
                        const { id, title, stock, image, price, rating } = item;

                        return (
                            <li
                                key={id}
                                className={styles.productItem}
                                data-testid={id}
                            >
                                <div className={styles.card}>
                                    <img
                                        src={image}
                                        alt="Item thumbnail"
                                        className={styles.thumbnail}
                                    />
                                    <hr />
                                    <div className={styles.infoContainer}>
                                        <h1 className={styles.itemName}>
                                            {title}
                                        </h1>
                                        <hr />
                                        <div
                                            className={styles.ratingContainer}
                                            data-testid="ratingsContainer"
                                        >
                                            <Rating
                                                readOnly
                                                precision={0.5}
                                                value={rating.rate}
                                                className={styles.rating}
                                                size="large"
                                                data-testid="ratings"
                                            />
                                            <p className={styles.ratingCount}>
                                                (<i>{rating.count}</i>)
                                            </p>
                                        </div>

                                        <div className={styles.info}>
                                            <div className={styles.infoLeft}>
                                                <p className={styles.price}>
                                                    Price: <b>{`$${price}`}</b>
                                                </p>
                                                <p
                                                    className={
                                                        styles.itemsRemaining
                                                    }
                                                >
                                                    {stock !== 0 ? (
                                                        <>
                                                            Left in stock:{" "}
                                                            <b>{item.stock}</b>
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
                                                <div
                                                    className={
                                                        styles.itemFooter
                                                    }
                                                >
                                                    <Button
                                                        variant="contained"
                                                        className={
                                                            styles.checkoutBtn
                                                        }
                                                        size="large"
                                                    >
                                                        Add to Cart
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className={styles.infoRight}>
                                                <p
                                                    className={
                                                        styles.description
                                                    }
                                                >
                                                    {item.description}
                                                </p>
                                            </div>
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
            {productItems.length > 0 ? (
                renderItems(productItems)
            ) : (
                <p>No products found...</p>
            )}
        </div>
    );
}

export default ProductList;
