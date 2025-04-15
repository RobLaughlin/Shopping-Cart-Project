import "./App.css";
// import ProductList from "./components/ProductList/ProductList.component";
import Cart from "./components/Cart/Cart.component";
function App() {
    const items = [
        {
            id: 1,
            title: "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
            price: 109.95,
            description:
                "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
            category: "men's clothing",
            image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
            rating: {
                rate: 3.9,
                count: 120,
            },
            stock: 10,
            quantity: 3,
        },
        {
            id: 3,
            title: "Mens Cotton Jacket",
            price: 55.99,
            description:
                "great outerwear jackets for Spring/Autumn/Winter, suitable for many occasions, such as working, hiking, camping, mountain/rock climbing, cycling, traveling or other outdoors. Good gift choice for you or your family member. A warm hearted love to Father, husband or son in this thanksgiving or Christmas Day.",
            category: "men's clothing",
            image: "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg",
            rating: {
                rate: 4.7,
                count: 500,
            },
            stock: 54,
            quantity: 2,
        },
        {
            id: 7,
            title: "White Gold Plated Princess",
            price: 9.99,
            description:
                "Classic Created Wedding Engagement Solitaire Diamond Promise Ring for Her. Gifts to spoil your love more for Engagement, Wedding, Anniversary, Valentine's Day...",
            category: "jewelery",
            image: "https://fakestoreapi.com/img/71YAIFU48IL._AC_UL640_QL65_ML3_.jpg",
            rating: {
                rate: 3,
                count: 400,
            },
            stock: 3,
            quantity: 3,
        },
        {
            id: 20,
            title: "DANVOUY Womens T Shirt Casual Cotton Short",
            price: 12.99,
            description:
                "95%Cotton,5%Spandex, Features: Casual, Short Sleeve, Letter Print,V-Neck,Fashion Tees, The fabric is soft and has some stretch., Occasion: Casual/Office/Beach/School/Home/Street. Season: Spring,Summer,Autumn,Winter.",
            category: "women's clothing",
            image: "https://fakestoreapi.com/img/61pHAEJ4NML._AC_UX679_.jpg",
            rating: {
                rate: 3.6,
                count: 145,
            },
            stock: 0,
            quantity: 0,
        },
    ];

    return (
        <div id="App">
            {/* <ProductList items={items} /> */}
            <Cart items={items} />
        </div>
    );
}

export default App;
