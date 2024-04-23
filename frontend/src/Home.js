import React, { useContext } from "react";
import { UserContext } from "./userContext";


export const Home = () => { 
    const { currentUser, balances  } = useContext(UserContext);
    if (!currentUser || !currentUser.user) {
        return <div>Welcome to Money Manager! please signup or login </div>; // Or any other appropriate loading indicator
    }
    return (
      
        <div>

            <h1>Welcome {currentUser.user.username}</h1>
                     
            <h3>Select what you would like to do</h3>
        </div>
    );
}