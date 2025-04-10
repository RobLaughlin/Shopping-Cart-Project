import { JSX, useState } from "react";

import styles from "./Cart.module.css";
import { CartItem } from "./Cart.schema";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";

type CartProps = {
    items?: CartItem[];
};

function Cart({ items = [] }: CartProps) {
    const [cartItems, setCartItems] = useState(items);

    function updateQuantity(item: CartItem, quantity: number) {
        item.updateQuantity(quantity);
        setCartItems([...cartItems]);
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
                            <li key={id} className={styles.cartItem}>
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
                                                aria-label="IncreaseQuantity"
                                                size="small"
                                                className={
                                                    styles.addIconContainer
                                                }
                                                color="success"
                                                onClick={() => {
                                                    updateQuantity(
                                                        item,
                                                        quantity + 1
                                                    );
                                                }}
                                            >
                                                <AddIcon />
                                            </IconButton>
                                            <hr />
                                            <IconButton
                                                aria-label="DecreaseQuantity"
                                                size="small"
                                                className={
                                                    styles.removeIconContainer
                                                }
                                                color="error"
                                                onClick={() => {
                                                    updateQuantity(
                                                        item,
                                                        quantity - 1
                                                    );
                                                }}
                                            >
                                                <RemoveIcon
                                                    className={
                                                        styles.removeIcon
                                                    }
                                                />
                                            </IconButton>
                                        </div>

                                        <p className={styles.itemsRemaining}>
                                            Items remaining:{" "}
                                            <b>{remainingItems}</b>
                                        </p>
                                        <p className={styles.totalPrice}>
                                            Total Price: <b>{total}</b>
                                        </p>
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
            {cartItems.length > 0 ? renderItems(cartItems) : <p>empty</p>}
        </div>
    );
}

export default Cart;
