import "./App.css";
import Cart from "./components/Cart.component";
import { CartItem } from "./components/Cart.schema";

function App() {
    const items = [
        new CartItem("Item 1", 10000n, 3n, new URL("http://127.0/")),
    ];

    return (
        <div id="App">
            <Cart items={items} />
        </div>
    );
}

export default App;
