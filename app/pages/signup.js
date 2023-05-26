'use client'
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useRouter } from 'next/navigation'

function Page() {
    const { user, signup } = useAuth()
    const [data, setData] = useState({
        email: '',
        password: '',
    })
    const router = useRouter()

    const handleSignup = async (e) => {
        e.preventDefault()

        try {
            await signup(data.email, data.password)
            router.push('/')
        } catch (err) {
            console.log(err)
        }
    }

    return (<div className="wrapper">
        <div className="form-wrapper">
            <h1 className="mt-60 mb-30">Sign up</h1>
            <form onSubmit={handleSignup} className="form">
                <label htmlFor="email">
                    <p>Email</p>
                    <input onChange={(e) =>
                        setData({
                            ...data,
                            email: e.target.value,
                        })} required type="email" name="email" id="email" placeholder="example@mail.com" />
                </label>
                <label htmlFor="password">
                    <p>Password</p>
                    <input onChange={(e) =>
                        setData({
                            ...data,
                            password: e.target.value,
                        })} required type="password" name="password" id="password" placeholder="password" />
                </label>
                <button type="submit">Sign up</button>
            </form>
        </div>
    </div>);
}

export default Page;