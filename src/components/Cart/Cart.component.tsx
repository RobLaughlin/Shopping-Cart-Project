import { useState } from "react";
import { cloneDeep } from "lodash-es";
import {
    ProductItemWithStock,
    PRODUCT_ITEM_WITH_STOCK_SCHEMA,
} from "../../Schemas/ProductItem.schema";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";

import styles from "./Cart.module.css";

type CartProps = {
    items?: ProductItemWithStock[];
};

function Cart({ items = [] }: CartProps) {
    const [productItems, setProductItems] = useState(
        cloneDeep(
            items.filter(
                (item) => PRODUCT_ITEM_WITH_STOCK_SCHEMA.safeParse(item).success
            )
        )
    );

    function updateQuantity(key: number | string, quantity: number): void {
        const item = productItems.find((item) => item.id === key);
        if (item === null || item === undefined) {
            return;
        }

        item.quantity = Math.max(0, Math.min(item.stock, quantity));
        setProductItems(cloneDeep(productItems));
    }

    function removeItem(key: number | string): void {
        setProductItems(
            cloneDeep(productItems.filter((item) => item.id !== key))
        );
    }

    function calculateTotalCost(items: ProductItemWithStock[]) {
        const totals = items.map((item) => item.price * item.quantity);
        const total = totals.reduce((acc, total) => {
            return acc + total;
        }, 0);

        return total.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
        });
    }

    function renderItems(items: ProductItemWithStock[]) {
        return (
            <>
                <ul className={styles["no-list-style"]}>
                    {items.map((item) => {
                        const { id, title, quantity, stock, image, price } =
                            item;

                        return (
                            <li
                                key={id}
                                className={styles.cartItem}
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
                                        <p className={styles.price}>
                                            Price:{" "}
                                            <b>
                                                {price.toLocaleString("en-US", {
                                                    style: "currency",
                                                    currency: "USD",
                                                })}
                                            </b>
                                        </p>
                                        <p className={styles.quantity}>
                                            Quantity: <b>{quantity}</b>
                                        </p>
                                        <div
                                            className={
                                                styles.quantityBtnContainer
                                            }
                                        >
                                            <IconButton
                                                data-testid="IncreaseQuantity"
                                                aria-label="IncreaseQuantity"
                                                size="small"
                                                className={
                                                    styles.addIconContainer
                                                }
                                                color="success"
                                                onClick={() => {
                                                    updateQuantity(
                                                        item.id as number,
                                                        quantity + 1
                                                    );
                                                }}
                                            >
                                                <AddIcon />
                                            </IconButton>
                                            <hr />
                                            <IconButton
                                                data-testid="DecreaseQuantity"
                                                aria-label="DecreaseQuantity"
                                                size="small"
                                                className={
                                                    styles.removeIconContainer
                                                }
                                                color="error"
                                                onClick={() => {
                                                    updateQuantity(
                                                        item.id,
                                                        quantity - 1
                                                    );
                                                }}
                                            >
                                                <RemoveIcon />
                                            </IconButton>
                                        </div>

                                        <p className={styles.itemsRemaining}>
                                            {stock !== 0 ? (
                                                <>
                                                    Items remaining:{" "}
                                                    <b>{stock}</b>
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
                                            <p className={styles.totalPrice}>
                                                Total Price:{" "}
                                                <b>
                                                    {(
                                                        item.price *
                                                        item.quantity
                                                    ).toLocaleString("en-US", {
                                                        style: "currency",
                                                        currency: "USD",
                                                    })}
                                                </b>
                                            </p>
                                            <IconButton
                                                data-testid="RemoveItem"
                                                aria-label="RemoveItem"
                                                size="large"
                                                className={styles.removeItem}
                                                color="error"
                                                onClick={() => {
                                                    removeItem(item.id);
                                                }}
                                            >
                                                <CloseIcon fontSize="large" />
                                            </IconButton>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
                <div className={styles.totalCostContainer}>
                    <p>
                        Total Cost: <b>{calculateTotalCost(items)}</b>
                    </p>
                    <Button
                        variant="contained"
                        className={styles.checkoutBtn}
                        size="large"
                    >
                        Checkout
                    </Button>
                </div>
            </>
        );
    }

    return (
        <div className={styles.cart}>
            {productItems.length > 0 ? (
                renderItems(productItems)
            ) : (
                <p>Shopping cart is empty</p>
            )}
        </div>
    );
}

export default Cart;
