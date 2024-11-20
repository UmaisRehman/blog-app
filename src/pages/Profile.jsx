import React, { useState, useEffect } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { updatePassword } from "firebase/auth";
import { auth, db } from "../config/firebase/config";
import { query, collection, where, getDocs } from "firebase/firestore";

const Profile = () => {
  const [userData, setUserData] = useState({
    fullname: "",
    email: "",
  });
  const [newFullname, setNewFullname] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchUserData = async () => {
    try {
      const userUid = auth.currentUser.uid;
  
      // Query the 'fullname' collection to find the document with the matching UID
      const q = query(
        collection(db, "fullname"),
        where("uid", "==", userUid)
      );
      const querySnapshot = await getDocs(q);
  
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0].data(); // Get the first document
        setUserData({
          fullname: userDoc.Fullname, // Case-sensitive, matches your field name in Firestore
          email: userDoc.email,
        });
      } else {
        console.log("No user data found");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const updateUserData = async () => {
    try {
      const userUid = auth.currentUser.uid;

      // Update fullname in the Firestore collection
      if (newFullname.trim() !== "") {
        const q = query(
          collection(db, "fullname"),
          where("uid", "==", userUid)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          // Get the first matching document and update it
          const docRef = querySnapshot.docs[0].ref;
          await updateDoc(docRef, { Fullname: newFullname });
          setUserData((prev) => ({ ...prev, fullname: newFullname }));
        }
      }

      // Update user password in Firebase Authentication
      if (newPassword.trim() !== "") {
        await updatePassword(auth.currentUser, newPassword);
        alert("Password updated successfully!");
      }

      // Close the modal
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating user data:", error);
      alert("Error updating profile. Please try again.");
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="card w-96 bg-white shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Profile</h2>
          <p><strong>Fullname:</strong> {userData.fullname}</p>
          <p><strong>Email:</strong> {userData.email}</p>
          <div className="card-actions justify-end">
            <button
              className="btn btn-primary"
              onClick={() => setIsModalOpen(true)}
            >
              Update Profile
            </button>
          </div>
        </div>
      </div>

      {/* Update Modal */}
      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Update Profile</h3>
            <div className="mt-4">
              <label className="label">
                <span className="label-text">New Fullname</span>
              </label>
              <input
                type="text"
                placeholder="Enter new fullname"
                className="input input-bordered w-full"
                value={newFullname}
                onChange={(e) => setNewFullname(e.target.value)}
              />
            </div>
            <div className="mt-4">
              <label className="label">
                <span className="label-text">New Password</span>
              </label>
              <input
                type="password"
                placeholder="Enter new password"
                className="input input-bordered w-full"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="modal-action">
              <button
                className="btn btn-secondary"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button className="btn btn-primary" onClick={updateUserData}>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
