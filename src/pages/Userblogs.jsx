import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../config/firebase/firebasemethods';
import { collection, getDocs, query, where } from 'firebase/firestore';

const Userblogs = () => {
  const { id } = useParams(); // id from URL params
  const [username, setUsername] = useState(''); // State to hold username
  const [blogs, setBlogs] = useState([]); // State to hold blogs

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
      <div className='text-center mt-3 text-2xl'>
      {username ? <h1>{username}'s Blogs </h1>: "Loading..."}
      </div>
      <div className='flex justify-center flex-wrap gap-5 m-5'>
        {blogs && blogs.map((item,index) => {
          return <div key={index} className="card bg-base-100 w-96 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">{item.title}</h2>
              <p>{item.description}</p>
            
            </div>
          </div>
        })}

      </div>
    </>
  );
};

export default Userblogs;
