
import React, { useState, useEffect, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { UserContext } from "./userContext";

export const EditForm = () => {
    const { currentUser } = useContext(UserContext);
    const form = {
        firstName: "",
        lastName: "",
    };


    const [edit, setEdit] = useState(form);
    const [update, setUpdate] = useState(null);
    const navigate = useNavigate();


    async function handleSubmit(e) {
        e.preventDefault();
        try {
        setUpdate(true);
        }
        catch (e) {
            setUpdate(false);
            console.error(e);
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEdit(prevState => ({
            ...prevState,
            [name]: value
        }));
    };


    // if (!currentUser) {
        
    //     navigate("/");
    //     return null;
    // }
    return (
        <>
            <h1>Profile</h1>

            <form onSubmit={handleSubmit}>
                {

                }
                <label htmlFor="username"><b>Username</b></label>
                <input
                    readOnly
                    name="username"
                    value={"hi"}
                    // value={currentUser.user.username}
                />


                <label htmlFor="firstName"><b>First name</b></label>
                <input
                    name="firstName"
                    type="text"
                    onChange={handleChange}
                    value={edit.firstName}
                />

                <label htmlFor="lastName"><b>Last name</b></label>
                <input
                    name="lastName"
                    type="text"
                    onChange={handleChange}
                    value={edit.lastName}
                />

                <label htmlFor="email"><b>Email</b></label>
                <input
                    name="email"
                    type="text"
                    onChange={handleChange}
                    value={edit.email}
                />
                <br />
                {update ? <p> updated successfully </p> :
                    null

                }
                <button> Submit </button>
            </form>

        </>
    )
}