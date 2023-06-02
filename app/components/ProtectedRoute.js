import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { useAuth } from '../providers/AuthContextProvider'

const ProtectedRoute = ({children}) => {
    const { user, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!user) {
            router.push('/auth')
        }
    }, [user])

    if (loading) {
        return <div>loading ...</div>
    }

    if (user) {
        return <>{children}</>
    }

    return <div>404 ...</div>
}

export default ProtectedRoute