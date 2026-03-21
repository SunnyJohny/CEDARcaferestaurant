import React, { createContext, useContext, useState, useEffect } from "react";
import {
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

const MyContext = createContext();

export const useMyContext = () => {
  const context = useContext(MyContext);
  console.log("✅ useMyContext hook called. Current context:", context);
  return context;
};

const initialState = {
  cart: [],
  isCartOpen: false,
};

export const MyContextProvider = ({ children }) => {
  const [state, setState] = useState(initialState);
  const [dishes, setDishes] = useState([]);
  const [comments, setComments] = useState([]);
  const [loadingDishes, setLoadingDishes] = useState(true);
  const [loadingComments, setLoadingComments] = useState(true);

  // ✅ Log anonymous visit once per browser session
  useEffect(() => {
    const hasVisited = sessionStorage.getItem("visitLogged");

    if (!hasVisited) {
      const logVisit = async () => {
        try {
          await addDoc(collection(db, "visitors"), {
            timestamp: serverTimestamp(),
          });
          sessionStorage.setItem("visitLogged", "true");
          console.log("✅ Visitor logged");
        } catch (err) {
          console.error("❌ Error logging visit:", err);
        }
      };

      logVisit();
    }
  }, []);

  // ✅ Fetch dishes ONCE instead of live listener
  useEffect(() => {
    let isMounted = true;

    const fetchDishes = async () => {
      try {
        setLoadingDishes(true);

        const snapshot = await getDocs(collection(db, "dishes"));
        const dishData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        if (isMounted) {
          setDishes(dishData);
        }
      } catch (error) {
        console.error("❌ Error fetching dishes:", error);
      } finally {
        if (isMounted) {
          setLoadingDishes(false);
        }
      }
    };

    fetchDishes();

    return () => {
      isMounted = false;
    };
  }, []);

  // ✅ Fetch comments ONCE after dishes load
  useEffect(() => {
    let isMounted = true;

    const fetchAllComments = async () => {
      if (!dishes.length) {
        setComments([]);
        setLoadingComments(false);
        return;
      }

      try {
        setLoadingComments(true);

        const commentPromises = dishes.map(async (dish) => {
          const commentRef = collection(db, "dishes", dish.id, "comments");
          const commentSnapshot = await getDocs(commentRef);

          return commentSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            dishId: dish.id,
          }));
        });

        const commentsByDish = await Promise.all(commentPromises);
        const flatComments = commentsByDish.flat();

        if (isMounted) {
          setComments(flatComments);
        }
      } catch (error) {
        console.error("❌ Error fetching comments:", error);
      } finally {
        if (isMounted) {
          setLoadingComments(false);
        }
      }
    };

    fetchAllComments();

    return () => {
      isMounted = false;
    };
  }, [dishes]);

  // ✅ Optional manual refresh if needed somewhere in app
  const refreshDishesAndComments = async () => {
    try {
      setLoadingDishes(true);
      setLoadingComments(true);

      const snapshot = await getDocs(collection(db, "dishes"));
      const dishData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setDishes(dishData);

      const commentPromises = dishData.map(async (dish) => {
        const commentRef = collection(db, "dishes", dish.id, "comments");
        const commentSnapshot = await getDocs(commentRef);

        return commentSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          dishId: dish.id,
        }));
      });

      const commentsByDish = await Promise.all(commentPromises);
      setComments(commentsByDish.flat());
    } catch (error) {
      console.error("❌ Error refreshing data:", error);
    } finally {
      setLoadingDishes(false);
      setLoadingComments(false);
    }
  };

  // ✅ Capitalize helper
  const capitalizeWords = (text) =>
    text?.replace(/\b\w/g, (char) => char.toUpperCase());

  // ✅ Cart management
  const toggleCart = () =>
    setState((prev) => ({ ...prev, isCartOpen: !prev.isCartOpen }));

  const addToCart = (product, customPrice) => {
    setState((prev) => {
      const exists = prev.cart.find((item) => item.id === product.id);

      if (exists) {
        return {
          ...prev,
          cart: prev.cart.map((item) =>
            item.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }

      return {
        ...prev,
        cart: [
          ...prev.cart,
          { ...product, price: customPrice ?? product.price, quantity: 1 },
        ],
      };
    });
  };

  const removeFromCart = (productId) =>
    setState((prev) => ({
      ...prev,
      cart: prev.cart.filter((item) => item.id !== productId),
    }));

  const clearCart = () =>
    setState((prev) => ({
      ...prev,
      cart: [],
    }));

  const increaseQuantity = (productId) =>
    setState((prev) => ({
      ...prev,
      cart: prev.cart.map((item) =>
        item.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ),
    }));

  const decreaseQuantity = (productId) =>
    setState((prev) => ({
      ...prev,
      cart: prev.cart
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0),
    }));

  // ✅ Search helpers
  const searchByKeyword = (items, keyword) => {
    if (!items || !Array.isArray(items) || typeof keyword !== "string") {
      return [];
    }

    const lowerCaseKeyword = keyword.toLowerCase();

    const containsKeyword = (value) => {
      if (typeof value === "string") {
        return value.toLowerCase().includes(lowerCaseKeyword);
      } else if (Array.isArray(value)) {
        return value.some(containsKeyword);
      } else if (typeof value === "object" && value !== null) {
        return Object.values(value).some(containsKeyword);
      }
      return false;
    };

    return items.filter((item) => containsKeyword(item));
  };

  const searchByDate = (items, startDate, endDate) => {
    if (!startDate || !endDate) return items;

    return items.filter((item) => {
      const itemDate = new Date(item.date);
      return itemDate >= startDate && itemDate <= endDate;
    });
  };

  return (
    <MyContext.Provider
      value={{
        ...state,
        dishes,
        comments,
        loadingDishes,
        loadingComments,
        refreshDishesAndComments,
        toggleCart,
        addToCart,
        removeFromCart,
        clearCart,
        increaseQuantity,
        decreaseQuantity,
        searchByKeyword,
        searchByDate,
        capitalizeWords,
      }}
    >
      {children}
    </MyContext.Provider>
  );
};