import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  collection,
  onSnapshot,
  getDocs,
  addDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase'; // ✅ adjust if needed

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

  // ✅ Log anonymous visit (once per session)
  useEffect(() => {
    const hasVisited = sessionStorage.getItem('visitLogged');
    if (!hasVisited) {
      const logVisit = async () => {
        try {
          await addDoc(collection(db, 'visitors'), {
            timestamp: serverTimestamp()
          });
          sessionStorage.setItem('visitLogged', 'true');
          console.log('✅ Visitor logged');
        } catch (err) {
          console.error('❌ Error logging visit:', err);
        }
      };
      logVisit();
    }
  }, []);

  // ✅ Fetch and listen to dishes, then comments
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'dishes'), async (snapshot) => {
      const dishData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setDishes(dishData);

      // Fetch all comments from each dish's subcollection
      const allComments = [];

      const fetchCommentsForDish = async (dishId) => {
        const commentSnapshot = await getDocs(collection(db, `dishes/${dishId}/comments`));
        commentSnapshot.forEach((doc) => {
          allComments.push({ id: doc.id, ...doc.data(), dishId });
        });
      };

      await Promise.all(dishData.map(dish => fetchCommentsForDish(dish.id)));
      setComments(allComments);
    });

    return () => unsubscribe();
  }, []);

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
    if (!items || !Array.isArray(items) || typeof keyword !== 'string') {
      return [];
    }
    const lowerCaseKeyword = keyword.toLowerCase();
    const containsKeyword = (value) => {
      if (typeof value === 'string') {
        return value.toLowerCase().includes(lowerCaseKeyword);
      } else if (Array.isArray(value)) {
        return value.some(containsKeyword);
      } else if (typeof value === 'object' && value !== null) {
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
        toggleCart,
        addToCart,
        removeFromCart,
        clearCart,
        increaseQuantity,
        decreaseQuantity,
        searchByKeyword,
        searchByDate,
        capitalizeWords
      }}
    >
      {children}
    </MyContext.Provider>
  );
};
