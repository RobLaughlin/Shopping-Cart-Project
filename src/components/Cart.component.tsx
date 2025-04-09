import styles from "./Cart.module.css";
import { CartItem } from "./Cart.schema";

type CartProps = {
    items?: CartItem[];
};

function Cart({ items = [] }: CartProps) {
    return (
        <div className="cart">
            <ul>
                {items.map((item) => {
                    const { id, name, quantity, imgURL } = item;
                    const price = item.price(true);
                    const total = item.total(true);

                    return (
                        <li key={id} className={styles.cartItem}>
                            <div className="card">
                                <ol>
                                    <li>NAME: {name}</li>
                                    <li>QUANTITY: {quantity}</li>
                                    <li>IMG: {imgURL.href}</li>
                                    <li>PRICE: {price}</li>
                                    <li>TOTAL: {total}</li>
                                </ol>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

export default Cart;
