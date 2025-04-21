import "./App.css";
// import ProductList from "./components/ProductList/ProductList.component";
// import Cart from "./components/Cart/Cart.component";
import ProductPage from "./components/ProductPage/ProductPage.component";
import { TEST_PRODUCT_ITEMS } from "../tests/Testdata";

function App() {
    return (
        <div id="App">
            <ProductPage items={TEST_PRODUCT_ITEMS} />
        </div>
    );
}

export default App;
