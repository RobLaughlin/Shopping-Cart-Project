import "./App.css";
import Cart from "./components/Cart.component";
import { CartItem } from "./components/Cart.schema";

function App() {
    const items = [
        new CartItem(
            "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
            10995,
            3,
            5,
            new URL("https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg"),
            1
        ),
        new CartItem(
            "Mens Casual Premium Slim Fit T-Shirts",
            2230,
            6,
            100,
            new URL(
                "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg"
            ),
            2
        ),
        new CartItem(
            "Silicon Power 256GB SSD 3D NAND A55 SLC Cache Performance Boost SATA III 2.5",
            10900,
            1,
            20,
            new URL("https://fakestoreapi.com/img/71kWymZ+c+L._AC_SX679_.jpg"),
            11
        ),
        new CartItem(
            "DANVOUY Womens T Shirt Casual Cotton Short",
            1299,
            0,
            0,
            new URL("https://fakestoreapi.com/img/61pHAEJ4NML._AC_UX679_.jpg"),
            20
        ),
    ];

    return (
        <div id="App">
            <Cart items={items} />
        </div>
    );
}

export default App;
