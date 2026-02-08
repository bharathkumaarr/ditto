import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'

// Check if Firebase is configured
const isFirebaseConfigured = !!(
    import.meta.env.VITE_FIREBASE_API_KEY &&
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN &&
    import.meta.env.VITE_FIREBASE_PROJECT_ID
)

type User = {
    uid: string
    displayName: string | null
    photoURL: string | null
    isAnonymous: boolean
} | null

interface AuthContextType {
    user: User
    loading: boolean
    isConfigured: boolean
    signInWithGoogle: () => Promise<void>
    signInAnonymously: () => Promise<void>
    signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User>(null)
    const [loading, setLoading] = useState(isFirebaseConfigured)
    const [authFunctions, setAuthFunctions] = useState<any>(null)

    useEffect(() => {
        if (!isFirebaseConfigured) {
            // Skip auth if not configured - app will work without login
            return
        }

        // Dynamically import Firebase auth only when configured
        import('../firebase/auth').then((authModule) => {
            setAuthFunctions(authModule)
            const unsubscribe = authModule.onAuthChange((firebaseUser: any) => {
                setUser(firebaseUser)
                setLoading(false)
            })
            return unsubscribe
        }).catch((error) => {
            console.error('Failed to initialize Firebase auth:', error)
            setLoading(false)
        })
    }, [])

    const handleSignInWithGoogle = async () => {
        if (!authFunctions) return
        try {
            await authFunctions.signInWithGoogle()
        } catch (error) {
            console.error('Google sign-in error:', error)
        }
    }

    const handleSignInAnonymously = async () => {
        if (!authFunctions) return
        try {
            await authFunctions.signInAnonymously()
        } catch (error) {
            console.error('Anonymous sign-in error:', error)
        }
    }

    const handleSignOut = async () => {
        if (!authFunctions) return
        try {
            await authFunctions.signOut()
        } catch (error) {
            console.error('Sign-out error:', error)
        }
    }

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            isConfigured: isFirebaseConfigured,
            signInWithGoogle: handleSignInWithGoogle,
            signInAnonymously: handleSignInAnonymously,
            signOut: handleSignOut
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
