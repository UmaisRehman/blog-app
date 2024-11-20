import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
      <h1 className='text-center mt-3 text-2xl'>All Blogs</h1>

      {loading && <div className='h-[90vh] flex justify-center items-center'>
        <span className="loading loading-spinner text-primary"></span>
      </div>}

      {error && <h1>Internal server error!</h1>}

      <div className='flex justify-center flex-wrap gap-5 m-5'>
        {blogs && blogs.map((item, index) => {
          // Find the user data with the same uid from the fullname collection
          const user = fullnames?.find(fullname => fullname.uid === item.uid);

          return user ? (
            <div key={item.documentId} className="border border-gray-400 card bg-base-100 w-96 shadow-xl">
              <div className="card-body">
                {/* Title and Description Styling */}
                <div className="mb-4">
                  <h2 className="card-title text-xl font-semibold text-gray-800">{item.title}</h2>
                  <p className="text-gray-600">{item.description}</p>
                </div>

                {/* User Info Styling */}
                <div className="mt-4 px-3 py-2 bg-gray-100 rounded-md">
                  <h3 className="font-semibold text-lg text-blue-600">{user.Fullname}</h3>
                  <p className="text-sm text-gray-500">Email: {user.email}</p>
                </div>

                <div className="card-actions justify-end mt-3">
                  <a className='text-primary' onClick={() => singleUserBlog(item)}>See all from this user</a>
                </div>
              </div>
            </div>
          ) : null;
        })}
      </div>
    </>
  )
}

export default Home;
