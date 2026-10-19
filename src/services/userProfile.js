import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { db } from '../firebase'

export const DEFAULT_ROLE = 'customer'

export const getOrCreateUserProfile = async (user) => {
  if (!db || !user) {
    throw new Error('Firestore or Firebase user is unavailable.')
  }

  const profileReference = doc(db, 'users', user.uid)
  const profileSnapshot = await getDoc(profileReference)

  if (profileSnapshot.exists()) {
    return profileSnapshot.data()
  }

  const newProfile = {
    email: user.email,
    role: DEFAULT_ROLE,
    createdAt: serverTimestamp()
  }

  await setDoc(profileReference, newProfile)

  return {
    email: user.email,
    role: DEFAULT_ROLE
  }
}
