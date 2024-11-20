import { getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../config/firebase/config"; // Assuming auth and db are set up correctly
import {
  addDoc,
  collection,
  serverTimestamp,
  
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";

const Dashboard = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [blogsArray, setBlogsArray] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editIndex, setEditIndex] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

//   useEffect(() => {
//     const getdbFromFirebase = async () => {
//         const q = query(collection(db, "Blog"), where("uid", "==", auth.currentUser.uid));
//         const querySnapshot = await getDocs(q);

//         const fetchedblog = [];
//         querySnapshot.forEach((doc) => {
//             fetchedblog.push({
//                 ...doc.data(),
//                 docid: doc.id
//             });
//         });

//         setTodos(fetchedTodos);
//     };
//     getdbFromFirebase();
// }, []);


useEffect(() => {
  const fetchBlogs = async () => {
    try {
      // Query to fetch blogs where the UID matches the logged-in user's UID
      const q = query(
        collection(db, "Blog"),
        where("uid", "==", auth.currentUser.uid)
      );
      
      const querySnapshot = await getDocs(q);
      const blogs = [];
      
      // Iterate through the documents and add them to the blogs array
      querySnapshot.forEach((doc) => {
        blogs.push({ ...doc.data(), docId: doc.id });
      });
      
      setBlogsArray(blogs);  // Update the state with fetched blogs
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);  // Set loading state to false after fetching
    }
  };

  // Fetch blogs when component mounts
  fetchBlogs();
}, []);


  // Start Editing a Blog
  const startEditTodo = (index) => {
    setEditIndex(index);
    setEditTitle(blogsArray[index].title);
    setEditDescription(blogsArray[index].description);
  };

  // Save Edited Blog
  const saveTodo = async (index) => {
    const blogItem = blogsArray[index];

    if (!blogItem || !blogItem.docId) {
      console.error("Error: blogItem or docId is undefined.");
      return;
    }

    try {
      const blogRef = doc(db, "Blog", blogItem.docId);
      await updateDoc(blogRef, {
        title: editTitle,
        description: editDescription,
      });

      const updatedBlogs = [...blogsArray];
      updatedBlogs[index] = {
        ...updatedBlogs[index],
        title: editTitle,
        description: editDescription,
      };
      setBlogsArray(updatedBlogs);
      setEditIndex(null);
    } catch (error) {
      console.error("Error updating blog in Firebase:", error);
    }
  };

  // Fetch Blogs on Component Mount
  // useEffect(() => {
  //   const fetchBlogs = async () => {
  //     try {
  //       const querySnapshot = await getDocs(collection(db, "Blog"));
  //       const blogs = [];
  //       querySnapshot.forEach((doc) => {
  //         blogs.push({ ...doc.data(), docId: doc.id });
  //       });
  //       setBlogsArray(blogs);
  //     } catch (error) {
  //       console.error("Error fetching blogs:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchBlogs();
  // }, []);

  const addBlog = async (event) => {
    event.preventDefault();

    if (!title.trim() || !description.trim()) {
      setError("Please enter both title and description.");
      return;
    }

    setError("");
    setIsUploading(true);

    try {
      const docRef = await addDoc(collection(db, "Blog"), {
        title: title.trim(),
        description: description.trim(),
        uid: auth.currentUser.uid,
        // username: ???, 
        // useremail: ??,
        createdAt: serverTimestamp(),
      });

      setBlogsArray((prev) => [
        ...prev,
        {
          title: title.trim(),
          description: description.trim(),
          createdAt: new Date(),
          docId: docRef.id,
        },
      ]);

      setTitle("");
      setDescription("");
    } catch (e) {
      console.error("Error adding document:", e);
    } finally {
      setIsUploading(false);
    }
  };

  const deleteBlog = async (docId) => {
    try {
      await deleteDoc(doc(db, "Blog", docId));
      setBlogsArray((prev) => prev.filter((blog) => blog.docId !== docId));
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  return (
    <>
      {/* Form Section */}
      <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
        <div className="card w-full max-w-lg bg-white shadow-lg rounded-lg p-6">
          <h1 className="text-2xl font-bold text-center mb-4">Publish Blogs</h1>
          <form className="space-y-4" onSubmit={addBlog}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Blog Title</span>
              </label>
              <input
                type="text"
                placeholder="Enter your blog title"
                className="input input-bordered w-full"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Content</span>
              </label>
              <textarea
                placeholder="What's on your mind?"
                className="textarea textarea-bordered w-full"
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isUploading || !title.trim() || !description.trim()}
            >
              {isUploading ? "Uploading..." : "Upload"}
            </button>
          </form>
        </div>
      </div>

      {/* Blogs Section */}
      <div className="mt-10 px-4">
        <h2 className="text-2xl font-semibold text-center">Uploaded Blogs</h2>
        {loading ? (
          <p className="text-center mt-4">Loading blogs...</p>
        ) : blogsArray.length === 0 ? (
          <p className="text-center mt-4 text-gray-600">No blogs found. Start uploading your blogs!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {blogsArray.map((blog, index) => (
              <BlogCard
                key={blog.docId}
                blog={blog}
                isEditing={editIndex === index}
                editTitle={editTitle}
                editDescription={editDescription}
                onEditChange={(field, value) =>
                  field === "title"
                    ? setEditTitle(value)
                    : setEditDescription(value)
                }
                onSave={() => saveTodo(index)}
                onCancel={() => setEditIndex(null)}
                onDelete={deleteBlog}
                onEdit={() => startEditTodo(index)}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

const BlogCard = ({
  blog,
  isEditing,
  editTitle,
  editDescription,
  onEditChange,
  onSave,
  onCancel,
  onDelete,
  onEdit,
}) => {
  return (
    <div className="card bg-base-100 w-full  border border-gray-400 shadow-xl mb-10">
      <div className="card-body">
        {isEditing ? (
          <>
            <input
              type="text"
              className="input input-bordered mb-2 w-full"
              value={editTitle}
              onChange={(e) => onEditChange("title", e.target.value)}
            />
            <textarea
              className="textarea textarea-bordered mb-2 w-full"
              rows={4}
              value={editDescription}
              onChange={(e) => onEditChange("description", e.target.value)}
            ></textarea>
            <div className="card-actions justify-end">
              <button className="btn btn-success" onClick={onSave}>
                Save
              </button>
              <button className="btn btn-secondary" onClick={onCancel}>
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="card-title">{blog.title}</h2>
            <p className="truncate">{blog.description}</p>
            <div className="text-sm text-gray-500 mt-2 ">
              {blog.createdAt?.toDate
                ? blog.createdAt.toDate().toLocaleDateString()
                : new Date().toLocaleDateString()}
            </div>
            <div className="card-actions justify-end">
              <button className="btn btn-primary" onClick={onEdit}>
                Edit
              </button>
              <button className="btn btn-error" onClick={() => onDelete(blog.docId)}>
                Delete
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
