import React, { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { RoutesComponent } from './RoutesComponent';
import { Api } from './Api';
import { UserContext } from './userContext';
import { NavBar } from './NavBar';
import { jwtDecode } from "jwt-decode";
import "./App.css"
import { useLocalStorage } from './useLocalStorage';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from "react-router-dom";
export const TOKEN_STORAGE_ID = "api-token";

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [balances, setBalances] = useState(null);
  const [userToken, setUserToken] = useLocalStorage(TOKEN_STORAGE_ID);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    async function getUser() {
      setIsLoading(true);
      if (userToken) {
        try {
          console.log("token", userToken);
          let { username, id } = jwtDecode(userToken);
          Api.token = userToken;
          if (!Api.token) {
            throw new Error("No Token");
          }
          let user = await Api.getUserInfo(username);
          setCurrentUser(user);

          let retryCount = 0;
          while (retryCount < 3) {
            try {
              await Api.saveTransactions();
              await Api.saveBalance();
              let userBalances = await Api.getBalance();
              setBalances(userBalances);
              break;
            } catch (error) {
              if (error.response && error.response.status === 429) {
                console.log("Too many requests. Retrying... if continued failed try again in 24 hours");
                retryCount++;
                await new Promise((resolve) => setTimeout(resolve, 2000));
              } else {
                console.log("Error fetching balances/transactions :", error);
                break;
              }
            }
          }
        } catch (err) {
          console.log("Invalid Token:", err.message);
          setUserToken(TOKEN_STORAGE_ID);
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
      setIsLoading(false);
    }
    getUser();
  }, [userToken]);



  function logout() {
    setUserToken(null);
    setCurrentUser(null);
    toast.success("Logged out! See you next time");
  }

  async function register(username, password, firstName, lastName) {
    try {

      // Check password length
      if (password.length < 4) {
        toast.error("Password must be at least 4 characters long.");
        return false; // Return false for short password
      }

      const gotToken = await Api.signup(username, password, firstName, lastName);
      setUserToken(gotToken);
      Api.token = gotToken;
      toast.success("Signed up! Welcome " + username);
      setErrorMessage(null); // Reset error message

      return true; // Return true for successful registration
    } catch (e) {
      toast.error("All fields must be filled out 😅");
      console.log("Error:", e);
      return false; // Return false for failed registration
    }
  }

  async function login(username, password) {
    try {
      const getToken = await Api.login(username, password);
      console.log("token info", getToken);
      setUserToken(getToken);
      toast.success("Logged in! Welcome " + username);
      return true; // Return true for successful login
    } catch (e) {
      toast.error("Failed to log in 😢 Incorrect username/password");
      console.log("Error:", e);
      return false; // Return false for failed login
    }
  }

  return (
    <BrowserRouter>
      <UserContext.Provider value={{ currentUser, setCurrentUser, balances }}>
        <div className="App">
          <header className="App-header">
            <ToastContainer />
            <RoutesComponent register={register} login={login} logout={logout} />
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
          </header>
        </div>
      </UserContext.Provider>
    </BrowserRouter>
  );
}

export default App;
