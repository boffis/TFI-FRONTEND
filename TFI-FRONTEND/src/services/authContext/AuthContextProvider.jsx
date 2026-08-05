    import { useEffect, useState } from 'react'
    import { AuthContext, MEMBERSHIP } from './AuthContext'

    const getStoredUser = () => {
    const stored = localStorage.getItem('CurrentUser')
    if (!stored) return null

    try {
        return JSON.parse(stored)
    } catch {
        localStorage.removeItem('CurrentUser')
        return null
    }
    }

    const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(getStoredUser)

    useEffect(() => {
        if (user) {
        localStorage.setItem('CurrentUser', JSON.stringify(user))
        } else {
        localStorage.removeItem('CurrentUser')
        }
    }, [user])

    const handleLogin = (loggedInUser) => {
        setUser(loggedInUser)
    }

    const handleLogout = () => {
        setUser(null)
    }

    const handleUpdateUser = (updates) => {
        setUser((prevUser) => {
        if (!prevUser) return null
        return { ...prevUser, ...updates }
        })
    }

    const handleNewMembership = (membership) => {
        setUser((prevUser) => {
        if (!prevUser) return null
        return { ...prevUser, memberships: [...(prevUser.memberships || []), membership] }
        })
    }

    const handleCancelMembership = (membershipId) => {
        setUser((prevUser) => {
        if (!prevUser) return null
        const newMemberships = (prevUser.memberships || []).map((m) => {
            if (m.membershipId === membershipId) {
                return { ...m, isCancelled: true }
            }
            return m;
        })
        return { ...prevUser, memberships: newMemberships }
        })
    }

    const handleNewPayment = (payment) => {
        setUser((prevUser) => {
        if (!prevUser) return null
        return {
            ...prevUser,
            payments: [...(prevUser.payments || []), payment],
        }
        })
    }

    const handleEnrollClass = (inscription) => {
        setUser((prevUser) => {
        if (!prevUser) return null
        // inscription should be { inscriptionId, gymClassId }
        const alreadyInscribed = (prevUser.inscriptions || []).some(i => i.gymClassId === inscription.gymClassId)
        if (alreadyInscribed) return prevUser

        return {
            ...prevUser,
            inscriptions: [...(prevUser.inscriptions || []), inscription],
        }
        })
    }

    const handleDisenrollClass = (gymClassId) => {
        setUser((prevUser) => {
        if (!prevUser) return null

        return {
            ...prevUser,
            inscriptions: (prevUser.inscriptions || []).filter((i) => i.gymClassId !== gymClassId),
        }
        })
    }

    return (
        <AuthContext.Provider
        value={{
            user,
            handleLogin,
            handleLogout,
            handleUpdateUser,
            handleNewMembership,
            handleCancelMembership,
            handleNewPayment,
            handleEnrollClass,
            handleDisenrollClass,
        }}
        >
        {children}
        </AuthContext.Provider>
    )
    }

    export default AuthContextProvider
