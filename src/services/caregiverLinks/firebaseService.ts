
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  doc,
  getDoc,
  getFirestore
} from "firebase/firestore";
import { User } from "firebase/auth";
import { 
  LinkedUser, 
  FetchLinkedUsersResult,
  LinkUserResult,
  UnlinkUserResult
} from "./types";
import { initializeApp } from "firebase/app";
import firebaseConfig from "@/integrations/firebase/config";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Fetch all users linked to the caregiver
export const fetchLinkedUsers = async (
  user: User | null
): Promise<FetchLinkedUsersResult> => {
  if (!user) {
    return { linkedUsers: [] };
  }

  try {
    const caregiverLinksRef = collection(db, "caregiverLinks");
    const q = query(caregiverLinksRef, where("caregiver_id", "==", user.uid));
    const querySnapshot = await getDocs(q);

    const linkedUsers: LinkedUser[] = [];

    for (const doc of querySnapshot.docs) {
      const linkData = doc.data();
      try {
        linkedUsers.push({
          id: linkData.user_id,
          linkId: doc.id,
          email: `User ${linkData.user_id.slice(0, 8)}...` // Just use a shortened ID for display
        });
      } catch (err) {
        console.error("Error processing linked user details:", err);
      }
    }

    return { linkedUsers };
  } catch (error) {
    console.error("Error in fetchLinkedUsers:", error);
    return { linkedUsers: [] };
  }
};

// Link a caregiver to a user using the link code
export const linkUserWithCode = async (
  linkCode: string, 
  user: User | null
): Promise<LinkUserResult> => {
  if (!linkCode.trim() || !user) {
    return {
      success: false,
      message: "Missing link code or not authenticated"
    };
  }

  try {
    // Find the user with this link code
    const userLinksRef = collection(db, "userLinks");
    const q = query(userLinksRef, where("link_code", "==", linkCode));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return {
        success: false,
        message: "Invalid link code or user not found"
      };
    }

    const linkData = querySnapshot.docs[0].data();
    const userId = linkData.user_id;

    // Check if this link already exists
    const caregiverLinksRef = collection(db, "caregiverLinks");
    const existingLinkQuery = query(
      caregiverLinksRef,
      where("caregiver_id", "==", user.uid),
      where("user_id", "==", userId)
    );
    const existingLinkSnapshot = await getDocs(existingLinkQuery);

    if (!existingLinkSnapshot.empty) {
      return {
        success: false,
        message: "You are already linked to this user"
      };
    }

    // Create the caregiver link
    const newLinkRef = await addDoc(caregiverLinksRef, {
      caregiver_id: user.uid,
      user_id: userId
    });

    return {
      success: true,
      message: "Successfully linked with the user",
      newLink: {
        id: newLinkRef.id,
        user_id: userId
      }
    };
  } catch (error) {
    console.error("Error in linkUserWithCode:", error);
    return {
      success: false,
      message: "Error linking with user. Please try again."
    };
  }
};

// Unlink a user from the caregiver
export const unlinkUser = async (
  linkId: string,
  user: User | null
): Promise<UnlinkUserResult> => {
  if (!user || !linkId) {
    return {
      success: false,
      message: "Missing link id or not authenticated"
    };
  }

  try {
    // Get the link document
    const linkRef = doc(db, "caregiverLinks", linkId);
    const linkDoc = await getDoc(linkRef);
    
    if (!linkDoc.exists()) {
      return {
        success: false,
        message: "Link not found"
      };
    }
    
    const linkData = linkDoc.data();
    
    // Ensure the caregiver owns this link before deleting
    if (linkData.caregiver_id !== user.uid) {
      return {
        success: false,
        message: "You don't have permission to unlink this user"
      };
    }
    
    // Delete the link
    await deleteDoc(linkRef);

    return {
      success: true,
      message: "User has been unlinked successfully"
    };
  } catch (error) {
    console.error("Error unlinking user:", error);
    return {
      success: false,
      message: "Error unlinking user. Please try again."
    };
  }
};
