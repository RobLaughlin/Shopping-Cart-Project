import { ProductItemWithStock } from "../../Schemas/ProductItem.schema";

import Button from "@mui/material/Button";
import Rating from "@mui/material/Rating";
import componentStyles from "./ProductList.module.css";
import { Link } from "react-router-dom";

type ProductListProps = {
    items?: ProductItemWithStock[];
    addToCartHandler: (item: ProductItemWithStock) => void;
    styleOverrides?: object;
};

function ProductList({
    items = [],
    addToCartHandler,
    styleOverrides = {},
}: ProductListProps) {
    const styles = { ...componentStyles, ...styleOverrides };

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
                                        <p className={styles.category}>
                                            Category: <i>{item.category}</i>
                                        </p>
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
                                                        onClick={() => {
                                                            addToCartHandler(
                                                                item
                                                            );
                                                        }}
                                                        disabled={
                                                            stock === 0
                                                                ? true
                                                                : false
                                                        }
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
                <div className={styles.viewCartContainer}>
                    <Link to="/cart" className={styles.viewCartBtnContainer}>
                        <Button
                            variant="contained"
                            className={styles.viewCartBtn}
                            size="large"
                        >
                            View Cart
                        </Button>
                    </Link>
                </div>
            </>
        );
    }

    return (
        <div className={styles.products}>
            {items.length > 0 ? (
                renderItems(items)
            ) : (
                <p>No products found...</p>
            )}
        </div>
    );
}

export default ProductList;
