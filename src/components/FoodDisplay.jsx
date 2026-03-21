import React, { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc,
  serverTimestamp,
  increment,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { db, storage } from "../firebase";
import { FaTrash, FaEdit } from "react-icons/fa";
import { FaRegCommentDots } from "react-icons/fa6";
import { toast } from "react-toastify";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useMyContext } from "../Context/MyContext";

export default function Dishes() {
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [newDish, setNewDish] = useState({
    name: "",
    description: "",
    priceOriginal: "",
    priceDiscounted: "",
    image: null,
    category: "",
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDish, setEditingDish] = useState(null);
  const [commentModal, setCommentModal] = useState(null);
  const [commentInput, setCommentInput] = useState("");
  const [commentName, setCommentName] = useState("");
  const [commentsMap, setCommentsMap] = useState({});
  const { addToCart, dishes, capitalizeWords } = useMyContext();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribes = dishes.map((dish) =>
      onSnapshot(collection(db, "dishes", dish.id, "comments"), (snapshot) => {
        setCommentsMap((prev) => ({
          ...prev,
          [dish.id]: snapshot.docs.map((commentDoc) => ({
            id: commentDoc.id,
            ...commentDoc.data(),
          })),
        }));
      })
    );

    return () => unsubscribes.forEach((unsubscribe) => unsubscribe());
  }, [dishes]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      setNewDish((prev) => ({
        ...prev,
        image: files[0],
      }));
    } else {
      setNewDish((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmitDish = async () => {
    const {
      name,
      description,
      priceOriginal,
      priceDiscounted,
      image,
      category,
    } = newDish;

    if (!name || !description || !priceOriginal || !priceDiscounted || !category) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      let imageUrl = editingDish?.image || null;

      if (image) {
        const imageRef = ref(storage, `dishes/${Date.now()}-${image.name}`);
        await uploadBytesResumable(imageRef, image);
        imageUrl = await getDownloadURL(imageRef);
      }

      const dishData = {
        name,
        description,
        priceOriginal: parseFloat(priceOriginal),
        priceDiscounted: parseFloat(priceDiscounted),
        image: imageUrl,
        category,
        likes: editingDish?.likes || 0,
        createdAt: serverTimestamp(),
      };

      if (editingDish) {
        await updateDoc(doc(db, "dishes", editingDish.id), dishData);
        toast.success("Dish updated successfully");
      } else {
        await addDoc(collection(db, "dishes"), dishData);
        toast.success("Dish added successfully");
      }

      setNewDish({
        name: "",
        description: "",
        priceOriginal: "",
        priceDiscounted: "",
        image: null,
        category: "",
      });
      setEditingDish(null);
      setShowAddModal(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to save dish");
    }
  };

  const handleEdit = (dish) => {
    setEditingDish(dish);
    setNewDish({
      name: dish.name || "",
      description: dish.description || "",
      priceOriginal: dish.priceOriginal || "",
      priceDiscounted: dish.priceDiscounted || "",
      category: dish.category || "",
      image: null,
    });
    setShowAddModal(true);
  };

  const confirmDeleteToast = async (dish) => {
    if (window.confirm("Are you sure you want to delete this dish?")) {
      await deleteDoc(doc(db, "dishes", dish.id));
      toast.success("Dish deleted successfully");
    }
  };

  const handleLike = async (id) => {
    try {
      await updateDoc(doc(db, "dishes", id), {
        likes: increment(1),
      });
    } catch {
      toast.error("Unable to like this dish right now");
    }
  };

  const handleAddComment = async (dishId) => {
    if (!commentInput.trim() || !commentName.trim()) {
      toast.error("Please enter your name and a comment");
      return;
    }

    try {
      await addDoc(collection(db, "dishes", dishId, "comments"), {
        text: commentInput.trim(),
        name: commentName.trim(),
        createdAt: serverTimestamp(),
        userId: user?.uid || null,
      });

      setCommentInput("");
      setCommentName("");
      toast.success("Comment added successfully");
    } catch {
      toast.error("Failed to add comment");
    }
  };

  const handleDeleteComment = async (dishId, commentId) => {
    try {
      await deleteDoc(doc(db, "dishes", dishId, "comments", commentId));
      toast.success("Comment deleted");
    } catch {
      toast.error("Failed to delete comment");
    }
  };

  const filteredDishes = dishes.filter((dish) => {
    const query = searchQuery.toLowerCase();
    return (
      dish.name?.toLowerCase().includes(query) ||
      dish.description?.toLowerCase().includes(query) ||
      dish.category?.toLowerCase().includes(query)
    );
  });

  return (
    <section id="dishes" className="py-12 px-4 md:px-8 bg-blue-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-blue-950">
              Our Dishes
            </h2>
            <p className="text-gray-600 mt-2">
              Explore freshly prepared meals and add your favorites to cart.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <input
              type="text"
              placeholder="Search dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="px-4 py-3 border border-blue-200 rounded-lg w-full md:w-[320px] focus:outline-none focus:ring-2 focus:ring-blue-900 bg-white"
            />

            {user && (
              <button
                onClick={() => {
                  setNewDish({
                    name: "",
                    description: "",
                    priceOriginal: "",
                    priceDiscounted: "",
                    image: null,
                    category: "",
                  });
                  setEditingDish(null);
                  setShowAddModal(true);
                }}
                className="bg-blue-900 text-white px-5 py-3 rounded-lg hover:bg-blue-800 transition font-medium"
              >
                Add Dish
              </button>
            )}
          </div>
        </div>

        {filteredDishes.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-md border border-blue-100 p-10 text-center">
            <p className="text-gray-500 text-lg">No dishes found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredDishes.map((dish) => (
              <div
                key={dish.id}
                className="bg-white rounded-2xl shadow-md border border-blue-100 overflow-hidden hover:shadow-lg transition"
              >
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="w-full h-56 object-cover"
                />

                <div className="p-5">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="text-xl font-bold text-blue-950">
                      {capitalizeWords(dish.name)}
                    </h3>
                    <span className="text-xs bg-blue-100 text-blue-900 px-3 py-1 rounded-full whitespace-nowrap">
                      {dish.category}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-4 leading-relaxed line-clamp-3">
                    {dish.description}
                  </p>

                  <div className="mb-4">
                    <p className="text-sm text-gray-400">
                      Original Price:{" "}
                      <span className="line-through">
                        ₦{dish.priceOriginal?.toLocaleString()}
                      </span>
                    </p>
                    <p className="text-lg font-bold text-blue-900 mt-1">
                      ₦{dish.priceDiscounted?.toLocaleString()}
                    </p>
                  </div>

                  <div className="flex justify-between items-center gap-3 mb-4">
                    <button
                      onClick={() => handleLike(dish.id)}
                      className="text-pink-600 hover:text-pink-700 font-medium text-sm"
                    >
                      ❤️ {dish.likes || 0}
                    </button>

                    <button
                      onClick={() => {
                        setCommentModal(dish.id);
                        setCommentInput("");
                        setCommentName("");
                      }}
                      className="text-blue-700 hover:text-blue-900 flex items-center text-sm font-medium"
                    >
                      <FaRegCommentDots className="mr-1" />
                      {commentsMap[dish.id]?.length || 0}
                    </button>

                    <button
                      onClick={() => addToCart(dish, dish.priceDiscounted)}
                      className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition text-sm font-medium"
                    >
                      Add to Cart
                    </button>
                  </div>

                  {user && (
                    <div className="flex justify-end gap-4 pt-2 border-t border-blue-50">
                      <FaEdit
                        onClick={() => handleEdit(dish)}
                        className="text-blue-700 cursor-pointer hover:text-blue-900 text-lg"
                      />
                      <FaTrash
                        onClick={() => confirmDeleteToast(dish)}
                        className="text-pink-600 cursor-pointer hover:text-pink-700 text-lg"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* COMMENT MODAL */}
      {commentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-lg">
            <h3 className="text-2xl font-bold text-blue-950 mb-4">Comments</h3>

            <div className="mb-4 max-h-60 overflow-y-auto pr-1">
              {(commentsMap[commentModal] || []).length === 0 && (
                <div className="text-gray-400 text-center py-4">
                  No comments yet.
                </div>
              )}

              {(commentsMap[commentModal] || []).map((comment) => (
                <div
                  key={comment.id}
                  className="border-b border-gray-100 py-3 flex justify-between items-start gap-3"
                >
                  <div>
                    <p className="text-sm text-gray-800">
                      <span className="font-semibold">
                        {comment.name || "Anonymous"}:
                      </span>{" "}
                      {comment.text}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {comment.createdAt?.seconds
                        ? new Date(
                            comment.createdAt.seconds * 1000
                          ).toLocaleString()
                        : ""}
                    </p>
                  </div>

                  {user && (
                    <FaTrash
                      className="text-pink-600 cursor-pointer hover:text-pink-700 mt-1"
                      onClick={() => handleDeleteComment(commentModal, comment.id)}
                    />
                  )}
                </div>
              ))}
            </div>

            <input
              type="text"
              placeholder="Your name"
              className="w-full mb-3 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-900"
              value={commentName}
              onChange={(e) => setCommentName(e.target.value)}
            />

            <textarea
              placeholder="Add a comment..."
              className="w-full mb-4 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-900"
              rows="4"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
            ></textarea>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setCommentModal(null)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                Close
              </button>
              <button
                onClick={async () => {
                  await handleAddComment(commentModal);
                }}
                className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition"
              >
                Add Comment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-lg">
            <h3 className="text-2xl font-bold text-blue-950 mb-4">
              {editingDish ? "Edit Dish" : "Add Dish"}
            </h3>

            <input
              name="name"
              type="text"
              placeholder="Dish Name"
              value={newDish.name}
              onChange={handleInputChange}
              className="w-full mb-3 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-900"
            />

            <textarea
              name="description"
              placeholder="Description"
              value={newDish.description}
              onChange={handleInputChange}
              className="w-full mb-3 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-900"
              rows="4"
            />

            <input
              name="priceOriginal"
              type="number"
              placeholder="Original Price (₦)"
              value={newDish.priceOriginal}
              onChange={handleInputChange}
              className="w-full mb-3 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-900"
            />

            <input
              name="priceDiscounted"
              type="number"
              placeholder="Discounted Price (₦)"
              value={newDish.priceDiscounted}
              onChange={handleInputChange}
              className="w-full mb-3 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-900"
            />

            <input
              name="category"
              type="text"
              placeholder="Category (e.g. Snacks, Drinks, Meals)"
              value={newDish.category}
              onChange={handleInputChange}
              className="w-full mb-3 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-900"
            />

            <input
              name="image"
              type="file"
              accept="image/*"
              onChange={handleInputChange}
              className="w-full mb-4"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitDish}
                className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition"
              >
                {editingDish ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}