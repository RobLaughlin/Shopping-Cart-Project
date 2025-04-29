import ProductPage from "./components/ProductPage/ProductPage.component";
import { Routes, Route, useNavigate } from "react-router-dom";
import Cart from "./components/Cart/Cart.component";
import { useEffect, useState } from "react";
import {
    ProductItemWithStock,
    PRODUCT_ITEM_WITH_STOCK_SCHEMA,
} from "./Schemas/ProductItem.schema";
import MainNav from "./components/MainNav/MainNav.component";
import { cloneDeep } from "lodash-es";
import CircularProgress from "@mui/material/CircularProgress";

import "./App.css";

const PRODUCT_API_URL = "https://fakestoreapi.com/products";

function App() {
    const [cartItems, setCartItems] = useState(
        new Map<string, ProductItemWithStock>()
    );
    const [productItems, setProductItems] = useState<ProductItemWithStock[]>(
        []
    );
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Fetch data on component mount
    useEffect(() => {
        setLoading(true);
        const fetchProducts = async () => {
            const products = await fetch(PRODUCT_API_URL);
            const data = await products.json();

            return data
                .map((product: any) => {
                    const item: ProductItemWithStock = {
                        ...cloneDeep(product),
                        quantity: 1,
                        stock: Math.round(Math.random() * 20),
                    };
                    return item;
                })
                .filter((product: ProductItemWithStock) => {
                    return PRODUCT_ITEM_WITH_STOCK_SCHEMA.safeParse(product)
                        .success;
                });
        };

        fetchProducts()
            .catch(() => {
                setLoading(false);
            })
            .then((products: ProductItemWithStock[]) => {
                setProductItems(cloneDeep(products));
                setLoading(false);
            });
    }, []);

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
                            !loading ? (
                                <ProductPage
                                    items={productItems}
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
                            ) : (
                                <div className="loadingContainer">
                                    <div className="loadingTextAndIcon">
                                        <div className="loadingIconContainer">
                                            <CircularProgress
                                                className="loadingIcon"
                                                size="256px"
                                            />
                                        </div>
                                        <h1 className="loadingText">
                                            Loading product items...
                                        </h1>
                                    </div>
                                </div>
                            )
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
