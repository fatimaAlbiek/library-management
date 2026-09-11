import { NavLink, Outlet } from "react-router-dom";
import "./MainLayout.css";

function MainLayout() {
    return (
        <div className="layout">

            <aside className="sidebar">

                <div className="logo">
                    📚 Library
                </div>

                <nav className="sidebar-nav">

                    <NavLink to="/">
                        Dashboard
                    </NavLink>

                    <NavLink to="/books">
                        Books
                    </NavLink>

                    <NavLink to="/users">
                        Users
                    </NavLink>

                    <NavLink to="/borrowings">
                        Borrowings
                    </NavLink>

                </nav>

            </aside>

            <main className="main-content">
                <Outlet />
            </main>

        </div>
    );
}

export default MainLayout;