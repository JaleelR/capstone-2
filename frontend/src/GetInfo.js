import React, {useContext} from "react";
import { UserContext } from "./userContext";
export const GetInfo = () => {
    const { currentUser } = useContext(UserContext);
    return (
        <>
            <h1> Welcome to MoneyMate </h1>
            <button>
                Login
            </button>

            <button>
                SignUp
            </button>
        </>
    )
};