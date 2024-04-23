import React, { useContext } from "react";
import { NavLink, useNavigate } from 'react-router-dom';
import { UserContext } from "./userContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const NavBar = ({ logout }) => {
    const navigate = useNavigate();
    const { currentUser, balances } = useContext(UserContext);

    const handleClick = (e) => {
        e.preventDefault();
        logout();
        navigate('/');
    }

    return (
        <nav className="navbar bg-base-100 block">
            {currentUser !== null ? (
                <>
                    <div className="flex items-center space-x-4">
                        <NavLink to="/" className="text-xl font-bold">Money Manager</NavLink>
                     
                        <NavLink to="/transactions" className="btn btn-ghost">Transactions</NavLink>
                        <NavLink to="/invsout" className="btn btn-ghost">Money in vs out</NavLink>
                        <button onClick={handleClick} className="btn btn-ghost">Logout {currentUser.user.username}</button>
                        &nbsp;  &nbsp;  &nbsp;  &nbsp;  &nbsp;<div>{balances && (
                            <h5> Balance: ${parseFloat(balances.find(account => account.name.includes("CHECKING")).balance).toFixed(2)}</h5>
                        )}</div> 
                    </div>
                </>
            ) : (
                <>
                    <div className="flex items-center space-x-4">
                        <NavLink to="/login" className="btn btn-ghost">Login</NavLink>
                        <NavLink to="/signup" className="btn btn-ghost">Signup</NavLink>
                    </div>
                </>
            )}
        </nav>
    );
}
