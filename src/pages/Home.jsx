import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, getAllData } from "../config/firebase/firebasemethods";

const Home = () => {
  const [blogs, setBlogs] = useState(null);
  const [fullnames, setFullnames] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Fetching data from both collections
    Promise.all([
      getAllData('Blog'),
      getAllData('fullname')
    ])
    .then(([blogsRes, fullnamesRes]) => {
      console.log(blogsRes, fullnamesRes);
      setBlogs(blogsRes);
      setFullnames(fullnamesRes);
    })
    .catch((err) => {
      console.log(err);
      setError(true);
    })
    .finally(() => {
      setLoading(false);
    });
  }, []);

  // navigate
  const navigate = useNavigate();

  // single user blog
  const singleUserBlog = (item) => {
    if (!auth.currentUser) {
      console.log('user login nahi ha.');
      alert('user not logged in');
      return;
    }
    console.log('user login haa.', item);
    navigate(`/userblogs/${item.uid}`);
  }

  return (
    <>
    <div className='bg-gray-100 pb-16'>
      <div className="text-2xl text-center bg-white  font-extrabold ">
        <h1 className=' p-5' >
          ALL BLOGS
        </h1>
      </div>


      {loading && <div className='h-[90vh] flex justify-center items-center '>
        <span className="loading loading-spinner text-primary"></span>
      </div>}

      {error && <h1>Internal server error!</h1>}

      <div className='flex justify-center flex-wrap gap-5 mt-5'>
        {blogs && blogs.map((item, index) => {
          // Find the user data with the same uid from the fullname collection
          const user = fullnames?.find(fullname => fullname.uid === item.uid);

          return user ? (
            <div key={item.documentId} className="border  border-gray-200 card bg-base-100 shadow-xl" style={{width: "881px"}}>
              <div className="card-body">
                



                <div className="  py-2  rounded-md">
                  <div className="flex items-center gap-4 cursor-pointer" onClick={() => singleUserBlog(item)}>
                    <img
                      src="https://i.ibb.co/42YP27H/206855.png" 
                      alt={user.Fullname}
                      className="w-12 h-12 rounded-full"
                    />
                    <div className="flex flex-col">
                    <h2 className="card-title text-xl font-semibold text-gray-800">{item.title}</h2>
                      <h3 className="font-semibold text-lg text-blue-600"></h3>
                      <p className="font-semibold text-gray-500">{user.Fullname} -{new Date(item.createdAt.seconds * 1000).toLocaleDateString()}</p>

                    </div>
                    
                  </div>
                   
                </div>


                <div className="mb-1">
                  
                  <p className="text-gray-600">{item.description}</p>
                </div>

                {/* User Info Styling */}
               
                <div className="card-actions justify-end  ">
                  <p className="text-sm text-primary hover " onClick={() => singleUserBlog(item)}>see all from this user</p> {/* Displaying formatted date */}
                </div>
              
              </div>
            </div>
          ) : null;
        })}
      </div>
      </div>
      
    </>
  );
}

export default Home;
