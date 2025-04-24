import ProductPage from "./components/ProductPage/ProductPage.component";
import { TEST_PRODUCT_ITEMS } from "../tests/Testdata";
import { Routes, Route, useNavigate } from "react-router-dom";
import Cart from "./components/Cart/Cart.component";
import { useState } from "react";
import { ProductItemWithStock } from "./Schemas/ProductItem.schema";
import MainNav from "./components/MainNav/MainNav.component";
import "./App.css";
import { cloneDeep } from "lodash-es";

function App() {
    const [cartItems, setCartItems] = useState(
        new Map<string, ProductItemWithStock>()
    );
    const navigate = useNavigate();

    function addToCartBtnClicked(item: ProductItemWithStock) {
        const id = item.id as string;

        let newCartItem = null;
        if (cartItems.has(id)) {
            newCartItem = cloneDeep(cartItems.get(id)) as ProductItemWithStock;
        } else {
            newCartItem = cloneDeep(item);
            newCartItem.quantity = 0;
        }

        newCartItem.quantity = Math.min(
            newCartItem.stock,
            newCartItem.quantity + 1
        );
        cartItems.set(id, newCartItem);
        setCartItems(new Map(cartItems));
    }

    function cartBtnClicked() {
        navigate("/cart");
    }

    function cartChanged(newCartItems: ProductItemWithStock[]) {
        const items = cloneDeep(newCartItems);

        const newCartItemsMap = new Map();
        items.forEach((item) => {
            newCartItemsMap.set(item.id, cloneDeep(item));
        });

        setCartItems(newCartItemsMap);
    }

    return (
        <div id="App">
            <Routes>
                <Route path="/" element={<MainNav />}>
                    <Route
                        index
                        element={
                            <ProductPage
                                items={TEST_PRODUCT_ITEMS}
                                itemsInCart={[...cartItems.values()].reduce(
                                    (acc, item) => {
                                        acc += item.quantity;
                                        return acc;
                                    },
                                    0
                                )}
                                onCartBtnClicked={cartBtnClicked}
                                onAddToCartBtnClicked={addToCartBtnClicked}
                            />
                        }
                    />
                    <Route
                        path="/cart"
                        element={
                            <Cart
                                items={[...cartItems.values()]}
                                onCartChanged={cartChanged}
                            />
                        }
                    />
                </Route>
            </Routes>
        </div>
    );
}

export default App;
