import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

const ProtectedRoute = ({children}) => {
    const { user, loading } = useAuth()
    const router = useRouter()

    // TODO 404 page
    useEffect(() => {
        if (!user) {
            console.log('use effect');
            console.log(user);
            router.push('/login')
        }
    }, [user])

    if (loading) {
        return <div>loading ...</div>
    }

    if (user) {
        return <>{children}</>
    }

}

export default ProtectedRoute