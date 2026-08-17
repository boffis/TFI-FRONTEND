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

    /**
     * Subscribing again reuses the client's existing non-cancelled membership row on the backend
     * (MercadoPagoService.CreateSubscriptionAsync) instead of inserting a new one, so the same
     * membershipId comes back with the new plan. Replace that entry rather than appending —
     * appending leaves a stale duplicate sharing one id, which only clears on the next login.
     */
    const handleNewMembership = (membership) => {
        setUser((prevUser) => {
        if (!prevUser) return null
        const memberships = prevUser.memberships || []
        const isUpdate = membership.membershipId != null &&
            memberships.some((m) => m.membershipId === membership.membershipId)

        return {
            ...prevUser,
            memberships: isUpdate
            ? memberships.map((m) => (m.membershipId === membership.membershipId ? membership : m))
            : [...memberships, membership],
        }
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
