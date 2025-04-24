import { Link, Outlet } from "react-router-dom";
import styles from "./MainNav.module.css";

type NavItem = {
    text: string;
    link: string;
    id: number;
};

function MainNav() {
    const navItems: NavItem[] = [
        { text: "Products", link: "/" },
        { text: "Cart", link: "cart" },
    ].map((item, id) => {
        return { id, ...item };
    });

    return (
        <div className={styles.mainNav}>
            <nav>
                <ol className={styles.navItems}>
                    {navItems.map(({ text, link, id }) => {
                        return (
                            <li className={styles.navItem} key={id}>
                                <Link to={link}>{text}</Link>
                            </li>
                        );
                    })}
                </ol>
            </nav>
            <Outlet />
        </div>
    );
}

export default MainNav;
