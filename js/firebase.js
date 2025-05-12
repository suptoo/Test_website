// Firebase Configuration and Initialization
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-analytics.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-storage.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDuY1EhiKneD7P-6wS7nDdcI1tai0iY_aM",
  authDomain: "easycall-bd.firebaseapp.com",
  projectId: "easycall-bd",
  storageBucket: "easycall-bd.appspot.com", // Corrected storage bucket URL
  messagingSenderId: "118716206171",
  appId: "1:118716206171:web:ff4415627abf6ca2e8837e",
  measurementId: "G-MP1LWS3WJY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Function to save order to Firestore
export async function saveOrderToFirebase(orderData) {
  try {
    // Add a timestamp to the order
    orderData.timestamp = serverTimestamp();
    
    // Add the order to the 'orders' collection
    const docRef = await addDoc(collection(db, "orders"), orderData);
    console.log("Order saved with ID: ", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error saving order: ", error);
    throw error;
  }
}

// Function to upload file to Firebase Storage
export async function uploadFileToStorage(file, orderId) {
  try {
    // Create a storage reference
    const storageRef = ref(storage, `order-files/${orderId}/${file.name}`);
    
    // Upload the file
    const snapshot = await uploadBytes(storageRef, file);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    console.log("File uploaded successfully. Download URL: ", downloadURL);
    return {
      name: file.name,
      type: file.type,
      size: file.size,
      url: downloadURL,
      path: `order-files/${orderId}/${file.name}`
    };
  } catch (error) {
    console.error("Error uploading file: ", error);
    throw error;
  }
}

// Function to delete file from Firebase Storage
export async function deleteFileFromStorage(filePath) {
  try {
    const fileRef = ref(storage, filePath);
    await deleteObject(fileRef);
    console.log("File deleted successfully");
    return true;
  } catch (error) {
    console.error("Error deleting file: ", error);
    throw error;
  }
}