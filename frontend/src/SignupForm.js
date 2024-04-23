import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const SignupForm = ({ register }) => {
    const navigate = useNavigate();

    const form = {
        username: "",
        password: "",
        firstName: "",
        lastName: "",
    };

    const [signup, setSignup] = useState(form);

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            const userReg = await register(signup.username, signup.password, signup.firstName, signup.lastName);

            if (userReg) {
                console.log("userReg:", userReg);
                navigate("/connectbank");
            }
        } catch (error) {
            console.log("Error during registration:", error);

        }
    }


    const handleChange = (e) => {
        const { name, value } = e.target;
        setSignup(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    return (
        <>
            <h1 className="text-3xl">Signup</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="form-control flex flex-col">
                    <label className="label">
                        <span className="label-text">Username</span>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            onChange={handleChange}
                            value={signup.username}
                            autoComplete="username"
                            className="input input-bordered"
                        />
                    </label>
                </div>

                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Password</span>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            onChange={handleChange}
                            value={signup.password}
                            autoComplete="current-password"
                            className="input input-bordered"
                        />
                    </label>
                </div>

                <div className="form-control">
                    <label className="label">
                        <span className="label-text">First name</span>
                        <input
                            id="firstName"
                            name="firstName"
                            type="text"
                            onChange={handleChange}
                            value={signup.firstName}
                            className="input input-bordered"
                        />
                    </label>
                </div>

                <div className="form-control">
                    <label className="label">
                        <span className="label-text">Last name</span>
                        <input
                            id="lastName"
                            name="lastName"
                            type="text"
                            onChange={handleChange}
                            value={signup.lastName}
                            className="input input-bordered"
                        />
                    </label>
                </div>

                <button type="submit" id="submitButton" className="btn btn-primary">Submit</button>
            </form>
        </>
    );
}