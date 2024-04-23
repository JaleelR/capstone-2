import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import './form.css'
export const LoginForm = ({ login }) => {
    const navigate = useNavigate();

    const form = {
        username: "",
        password: "",
    };

    const [signup, setSignup] = useState(form);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const result = await login(signup.username, signup.password);
            if (result) {
                navigate("/");
            }
        } catch (error) {
            console.log("Error:", error);
            navigate("/login"); // Navigate back to the login page
        }
    };



    const handleChange = (e) => {
        const { name, value } = e.target;
        setSignup((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };
    return (
        <>
            <>
                <div className='enterform '>
                    <h1 className="text-2xl font-bold mb-4">Login</h1>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text"><b>Username</b></span>
                                <br />
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
                                <br />
                                <span className="label-text"><b>Password</b></span>
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

                        <button id="submitButton" type="submit" className="btn btn-primary">Submit</button>
                    </form>
                </div>
            </>

        </>
    );
}