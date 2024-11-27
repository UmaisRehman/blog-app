import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, getAllData } from "../config/firebase/firebasemethods";

const Home = () => {
  const [blogs, setBlogs] = useState(null);
  const [fullnames, setFullnames] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const [modalMessage, setModalMessage] = useState(''); // Message to show in the modal

  useEffect(() => {
    // Fetching data from both collections
    Promise.all([getAllData('Blog'), getAllData('fullname')])
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
      console.log('User is not logged in');
      setModalMessage('You need to be logged in to view All blogs From this User.');
      setIsModalOpen(true); // Show the modal
      return;
    }
    console.log('User is logged in', item);
    navigate(`/userblogs/${item.uid}`);
  }

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false); // Close the modal
  }

  return (
    <>
      <div className='bg-gray-100 pb-16'>
        <div className="text-2xl text-center bg-white font-extrabold">
          <h1 className='p-5'>
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
              <div key={item.documentId} className="border border-gray-200 card bg-base-100 shadow-xl" style={{ width: "881px" }}>
                <div className="card-body">
                  <div className="py-2 rounded-md">
                    <div className="flex items-center gap-4 cursor-pointer" onClick={() => singleUserBlog(item)}>
                      <img
                        src="https://i.ibb.co/42YP27H/206855.png"
                        alt={user.Fullname}
                        className="w-12 h-12 rounded-full"
                      />
                      <div className="flex flex-col">
                        <h2 className="card-title text-xl font-semibold text-gray-800">{item.title}</h2>
                        <p className="font-semibold text-gray-500">{user.Fullname} -{new Date(item.createdAt.seconds * 1000).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-1">
                    <p className="text-gray-600">{item.description}</p>
                  </div>

                  <div className="card-actions justify-end">
                    <p className="text-sm text-primary hover" onClick={() => singleUserBlog(item)}>See all from this user</p>
                  </div>
                </div>
              </div>
            ) : null;
          })}
        </div>
      </div>

      {/* Modal for displaying alert */}
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-4">Please Login</h2>
              <p className="text-gray-800 mb-6">{modalMessage}</p>
             <div className='flex justify-center gap-5'>

              <button
                onClick={closeModal}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                Close
              </button>
              <button onClick={()=>{navigate("/login")}}
                 className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                 
                 
                 >
                Login
              </button>
                  </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Home;
