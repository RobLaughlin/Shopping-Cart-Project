import { JSX, useState } from "react";

import styles from "./Cart.module.css";
import { CartItem } from "./Cart.schema";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";

type CartProps = {
    items?: CartItem[];
};

function Cart({ items = [] }: CartProps) {
    const [cartItems, setCartItems] = useState([
        ...items.map((itm) => {
            return new CartItem(
                itm.name,
                itm.price(false) as number,
                itm.quantity,
                itm.remainingItems,
                itm.imgURL,
                itm.id
            );
        }),
    ]);

    function updateQuantity(key: number | string, quantity: number): void {
        const item = cartItems.find((item) => item.id === key);
        if (item === null || item === undefined) {
            return;
        }

        item.updateQuantity(quantity);
        setCartItems([
            ...cartItems.map((itm) => {
                return new CartItem(
                    itm.name,
                    itm.price(false) as number,
                    itm.quantity,
                    itm.remainingItems,
                    itm.imgURL,
                    itm.id
                );
            }),
        ]);
    }

    function removeItem(key: number | string): void {
        setCartItems([
            ...cartItems
                .filter((item) => item.id !== key)
                .map((itm) => {
                    return new CartItem(
                        itm.name,
                        itm.price(false) as number,
                        itm.quantity,
                        itm.remainingItems,
                        itm.imgURL,
                        itm.id
                    );
                }),
        ]);
    }

    function calculateTotalCost(items: CartItem[]) {
        const totals = items.map((item) => item.total(false) as number);
        const cost = totals.reduce((acc, total) => {
            return acc + total;
        }, 0);

        return (cost / 100).toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
        });
    }

    function renderItems(items: CartItem[]) {
        return (
            <>
                <ul className={styles["no-list-style"]}>
                    {items.map((item) => {
                        const { id, name, quantity, remainingItems, imgURL } =
                            item;
                        const price = item.price(true);
                        const total = item.total(true);

                        return (
                            <li
                                key={id}
                                className={styles.cartItem}
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
                                            <p className={styles.totalPrice}>
                                                Total Price: <b>{total}</b>
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
            {cartItems.length > 0 ? (
                renderItems(cartItems)
            ) : (
                <p>Shopping cart is empty</p>
            )}
        </div>
    );
}

export default Cart;
