import {
    signInWithPopup,
    GoogleAuthProvider,
    signInAnonymously as firebaseSignInAnonymously,
    signOut as firebaseSignOut,
    onAuthStateChanged
} from 'firebase/auth'
import type { User } from 'firebase/auth'
import { auth } from './config'

const googleProvider = new GoogleAuthProvider()

export const signInWithGoogle = async (): Promise<User> => {
    const result = await signInWithPopup(auth, googleProvider)
    return result.user
}

export const signInAnonymously = async (): Promise<User> => {
    const result = await firebaseSignInAnonymously(auth)
    return result.user
}

export const signOut = async (): Promise<void> => {
    await firebaseSignOut(auth)
}

export const onAuthChange = (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, callback)
}

export type { User }
