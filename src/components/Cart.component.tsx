import styles from "./Cart.module.css";
import { CartItem } from "./Cart.schema";

type CartProps = {
    items?: CartItem[];
};

function Cart({ items = [] }: CartProps) {
    return (
        <div className={styles.cart}>
            <ul className={styles["no-list-style"]}>
                {items.map((item) => {
                    const { id, name, quantity, imgURL } = item;
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
                                    <div className={styles.priceAndQuantity}>
                                        <p className={styles.price}>
                                            Price: <b>{price}</b>
                                        </p>
                                        <p className={styles.quantity}>
                                            Quantity: <b>{quantity}</b>
                                        </p>
                                    </div>

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
