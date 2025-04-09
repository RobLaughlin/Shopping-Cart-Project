import "./App.css";
import Cart from "./components/Cart.component";
import { CartItem } from "./components/Cart.schema";

function App() {
    const items = [
        new CartItem(
            "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
            10995,
            3,
            new URL("https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg"),
            1
        ),
        new CartItem(
            "Mens Casual Premium Slim Fit T-Shirts",
            2230,
            6,
            new URL(
                "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg"
            ),
            2
        ),
    ];

    return (
        <div id="App">
            <Cart items={items} />
        </div>
    );
}

export default App;
