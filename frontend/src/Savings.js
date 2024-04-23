import React, {useContext} from "react";
import { UserContext } from "./userContext";
export const Savings = () => {
    const { currentUser } = useContext(UserContext);
    if (!currentUser) {
        return <div> No name</div>
    }
    return (
        <div>

            <h1> {currentUser.user.username} How much you could save  🤑</h1>
          
        </div>
    )
};