import { getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../config/firebase/config";
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

  // Fetch blogs on component mount
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const q = query(
          collection(db, "Blog"),
          where("uid", "==", auth.currentUser.uid)
        );

        const querySnapshot = await getDocs(q);
        const blogs = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          docId: doc.id,
        }));

        setBlogsArray(blogs);
      } catch (err) {
        setError("Error fetching blogs.");
        console.error("Error fetching blogs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Add a new blog
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
      setError("Error adding the blog.");
      console.error("Error adding document:", e);
    } finally {
      setIsUploading(false);
    }
  };

  // Delete a blog
  const onDelete = async (docId) => {
    try {
      await deleteDoc(doc(db, "Blog", docId));
      setBlogsArray((prev) => prev.filter((blog) => blog.docId !== docId));
    } catch (err) {
      setError("Error deleting the blog.");
      console.error("Error deleting blog:", err);
    }
  };

  // Start editing a blog
  const onEdit = (index) => {
    setEditIndex(index);
    setEditTitle(blogsArray[index].title);
    setEditDescription(blogsArray[index].description);
  };

  // Cancel edit
  const onCancel = () => {
    setEditIndex(null);
    setEditTitle("");
    setEditDescription("");
  };

  // Save edited blog
  const onSave = async () => {
    if (editIndex === null) return;

    const blogItem = blogsArray[editIndex];
    try {
      const blogRef = doc(db, "Blog", blogItem.docId);
      await updateDoc(blogRef, {
        title: editTitle,
        description: editDescription,
      });

      const updatedBlogs = [...blogsArray];
      updatedBlogs[editIndex] = {
        ...blogItem,
        title: editTitle,
        description: editDescription,
      };
      setBlogsArray(updatedBlogs);
      onCancel();
    } catch (err) {
      setError("Error updating the blog.");
      console.error("Error updating blog in Firebase:", err);
    }
  };

  return (
    <>
      {/* Page Title */}
      <div className="text-2xl text-center bg-white font-extrabold shadow-md">
        <h1 className="p-5">Dashboard</h1>
      </div>
    <div className="p-10 bg-gray-200">
      <div className="bg-gray-200">
        {/* Form Section */}
        <div className="flex justify-center w-full bg-gray-200 px-4">
          <div className=" max-w-[1030px] w-full mb-6">
            <div className="card bg-white drop-shadow-2xl rounded-lg p-6">
              <form className="space-y-4" onSubmit={addBlog}>
                <div className="form-control">
                  <input
                    type="text"
                    placeholder="Enter your blog title"
                    className="input input-bordered w-full mt-4"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="form-control">
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
        </div>

        {/* Blog Cards */}
        <div className="px-4 flex flex-wrap bg-gray-200 justify-center">
          <h2 className="text-2xl font-semibold">My Blogs</h2>

          <div className="flex justify-center flex-wrap gap-5 mt-5">
            {loading ? (
              <div className="h-[90vh] flex justify-center items-center">
                <span className="loading loading-spinner text-primary"></span>
              </div>
            ) : blogsArray.length === 0 ? (
              <p className="text-center text-gray-600">No blogs found. Start uploading your blogs!</p>
            ) : (
              blogsArray.map((blog, index) => (
                <div
                  key={blog.docId}
                  className="border border-gray-200 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 w-5/6"
                  
                >
                  <div className="card-body p-5">
                    <h2 className="text-xl font-semibold text-gray-800">{blog.title}</h2>
                    <p className="text-gray-400">{blog.createdAt ? new Date(blog.createdAt.seconds * 1000).toLocaleString() : "Timestamp unavailable"}</p>

                    <p className="text-gray-700 mt-3 mb-3" >{blog.description}</p>
                    <div className="mt-4">
                      {editIndex === index ? (
                        <>
                          <input
                            type="text"
                            className="input input-bordered w-full mb-2"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                          />
                          <textarea
                            className="textarea textarea-bordered w-full mb-2"
                            rows={4}
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                          ></textarea>
                          <div className="flex justify-end gap-2">
                            <button className="btn bg-green-400 text-green-950" onClick={onSave}>
                              Save
                              </button>
                            <button className="btn bg-red-400 text-red-900 " onClick={onCancel}>
                              Cancel
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="flex justify-start gap-2">
                          <button className="btn text-primary" onClick={() => onEdit(index)}>
                            Edit
                          </button>
                          <button className="btn text-primary" onClick={() => onDelete(blog.docId)}>
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      </div>
    </>

  );
};

export default Dashboard;
