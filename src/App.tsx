import "./App.css";
import Cart from "./components/Cart.component";
import { CartItem } from "./components/Cart.schema";

function App() {
    fetch("https://fakestoreapi.com/products")
        .then((response) => response.json())
        .then((data) => console.log(data));
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
        new CartItem(
            "Silicon Power 256GB SSD 3D NAND A55 SLC Cache Performance Boost SATA III 2.5",
            10900,
            1,
            new URL("https://fakestoreapi.com/img/71kWymZ+c+L._AC_SX679_.jpg"),
            11
        ),
    ];

    return (
        <div id="App">
            <Cart items={items} />
        </div>
    );
}

export default App;
