import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../config/firebase/firebasemethods';
import { collection, getDocs, query, where } from 'firebase/firestore';

const Userblogs = () => {
  const { id } = useParams(); // id from URL params
  const [username, setUsername] = useState(''); // State to hold username
  const [blogs, setBlogs] = useState([]); // State to hold blogs
  const [emailUser, setEmaiUser] = useState("")


  useEffect(() => {
    if (id) {
      getDataFromFirestore(id); // Call function with `id`
    }
  }, [id]);

  async function getDataFromFirestore(userId) {
    const dataArr = [];
    try {
      console.log("Fetching user data for UID:", userId);

      // Fetch FullName from the 'fullname' collection
      const q = query(collection(db, "fullname"), where("uid", "==", userId));
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
        console.log("Document fetched:", doc.data());
        dataArr.push({ ...doc.data(), docid: doc.id });
      });

      if (dataArr.length > 0) {
        setUsername(dataArr[0].Fullname); // Update username state
        setEmaiUser(dataArr[0].email);
      } else {
        console.error("No username found for this user. Ensure the UID exists in the 'fullname' collection.");
      }

      // Fetch user's blogs from the 'Blog' collection
      const blogQuery = query(collection(db, "Blog"), where("uid", "==", userId));
      const blogSnapshot = await getDocs(blogQuery);
      const userBlogs = [];
      blogSnapshot.forEach((doc) => {
        console.log("Blog fetched:", doc.data());
        userBlogs.push({ ...doc.data(), docid: doc.id });
      });

      setBlogs(userBlogs); // Update blogs state
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  return (
    <>
   
  <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-5 mt-5 rounded-lg shadow-lg w-full max-w-96 mx-auto text-white">
  <div className="flex flex-col items-center">
    <img
      className="w-16 h-16 rounded-full border-4 border-white shadow-md"
      src="https://i.ibb.co/42YP27H/206855.png"
      alt="User Icon"
    />
    <h1 className="text-2xl font-bold mt-3">{username}</h1>
    <p className="text-sm text-gray-200 mt-1">{emailUser}</p>
  </div>
</div>


      <div className="flex flex-col items-center gap-5 m-5">
  {blogs &&
    blogs.map((item, index) => {
      let blogDate;
      
      // Check if the `createdAt` is a Firestore Timestamp or a valid date string
      if (item.createdAt) {
      
        blogDate = item.createdAt.toDate
          ? item.createdAt.toDate() // Firestore Timestamp
          : new Date(item.createdAt); // String-based date or other formats
      } else {
        blogDate = null; // Handle missing date
      }

      return (
        <div
          key={index}
          className="w-full max-w-3xl bg-white border border-gray-200 shadow-md rounded-lg p-5"
        >
          <h2 className="text-xl font-bold text-gray-800">{item.title}</h2>
          <p className="text-sm text-gray-500 mb-3">
            {blogDate instanceof Date && !isNaN(blogDate)
              ? blogDate.toLocaleDateString() // Format the date
              : "Invalid Date"}
          </p>
          <p className="text-gray-700">{item.description}</p>
        </div>
      );
    })}
</div>



    </>
  );
};

export default Userblogs;
