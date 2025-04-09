import { useState } from "react";

import styles from "./Cart.module.css";
import { CartItem } from "./Cart.schema";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import IconButton from "@mui/material/IconButton";

type CartProps = {
    items?: CartItem[];
};

function Cart({ items = [] }: CartProps) {
    const [cartItems, setCartItems] = useState(items);

    function updateQuantity(item: CartItem, quantity: number) {
        item.updateQuantity(quantity);
        setCartItems([...cartItems]);
    }

    return (
        <div className={styles.cart}>
            <ul className={styles["no-list-style"]}>
                {cartItems.map((item) => {
                    const { id, name, quantity, remainingItems, imgURL } = item;
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
                                    <h1 className={styles.itemName}>{name}</h1>
                                    <hr />
                                    <p className={styles.price}>
                                        Price: <b>{price}</b>
                                    </p>
                                    <p className={styles.quantity}>
                                        Quantity: <b>{quantity}</b>
                                    </p>
                                    <div
                                        className={styles.quantityBtnContainer}
                                    >
                                        <IconButton
                                            aria-label="Increase quantity"
                                            size="small"
                                            className={styles.addIconContainer}
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
                                        <IconButton
                                            aria-label="Decrease quantity"
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
                                                className={styles.removeIcon}
                                            />
                                        </IconButton>
                                    </div>

                                    <p className={styles.itemsRemaining}>
                                        Items remaining: <b>{remainingItems}</b>
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
        </div>
    );
}

export default Cart;
