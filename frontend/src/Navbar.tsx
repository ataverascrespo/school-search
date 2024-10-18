import { NavLink } from "react-router-dom";

export function Navbar() {
    return (
        <nav className="w-full h-16 bg-neutral-50 shadow-md flex flex-row gap-24 items-center justify-center">
            <NavLink to={"/"}>
              <h1 className="font-light text-base lg:text-lg hover:text-purple-400 hover:duration-200 hover:transition-all">Search Schools</h1>
            </NavLink>

            <NavLink to={"list"}>
              <h1 className="font-light text-base lg:text-lg hover:text-purple-400 hover:duration-200 hover:transition-all">My Saved Schools</h1>
            </NavLink>
        </nav>
    )
}