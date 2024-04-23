import React, { useState, useEffect } from "react";
import axios from "axios"
import { usePlaidLink } from 'react-plaid-link';
import { Api } from "./Api";
import { useNavigate } from "react-router-dom"
axios.defaults.baseURL = 'http://localhost:3001';

export const ConnectBank = () => {
    const [linkToken, setLinkToken] = useState();
    const [publicToken, setPublicToken] = useState();
    const navigate = useNavigate();


    useEffect(() => {
        async function token_link() {
            const linkToken = await Api.getLinkToken();
            console.log(linkToken)
            setLinkToken(linkToken);
        }
        token_link();
    }, []);



    const { open, ready } = usePlaidLink({
        token: linkToken,
        onSuccess: (public_token, metadata) => {
            setPublicToken(public_token);

        },
    });


    useEffect(() => {
        async function access_token() {
            if (publicToken) {
                await Api.exchangePublicToken(publicToken);
                navigate("/");

            } else {
                console.log("no public token");
            }
        };
        access_token();

    }, [publicToken])



    return (
        <div>

            <button className="btn btn-primary" onClick={() => open()} disabled={!ready}>
                Connect a bank account
            </button>
        </div>
    )
};