
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  UserCredential
} from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "@/integrations/firebase/client";

export type UserRole = 'autistic' | 'caregiver' | 'clinician';

// Sign up a new user
export const signUp = async (
  email: string, 
  password: string, 
  role: UserRole
): Promise<UserCredential> => {
  try {
    // Create the user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const { user } = userCredential;
    
    // Store the role and create a profile in Firestore
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      role: role,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    // If successfully created, store role in localStorage as well for redundancy
    localStorage.setItem('userRole', role);
    
    return userCredential;
  } catch (error) {
    console.error('Error during signup:', error);
    throw error;
  }
};

// Sign in an existing user
export const signIn = async (
  email: string, 
  password: string
): Promise<UserCredential> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Get the user role from Firestore
    const { user } = userCredential;
    const userDoc = await getDoc(doc(db, "users", user.uid));
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      localStorage.setItem('userRole', userData.role);
    }
    
    return userCredential;
  } catch (error) {
    console.error('Error during sign in:', error);
    throw error;
  }
};

// Sign out the current user
export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
    localStorage.removeItem('userRole');
  } catch (error) {
    console.error('Error during sign out:', error);
    throw error;
  }
};

// Reset password
export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error('Error sending password reset:', error);
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (
  displayName?: string, 
  photoURL?: string
): Promise<void> => {
  try {
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, {
        displayName: displayName || auth.currentUser.displayName,
        photoURL: photoURL || auth.currentUser.photoURL
      });
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

// Update user data in Firestore
export const updateUserData = async (
  userId: string, 
  data: Record<string, any>
): Promise<void> => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      ...data,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating user data:', error);
    throw error;
  }
};

// Get user data from Firestore
export const getUserData = async (userId: string): Promise<any> => {
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);
    
    if (userDoc.exists()) {
      return userDoc.data();
    }
    
    return null;
  } catch (error) {
    console.error('Error getting user data:', error);
    throw error;
  }
};
