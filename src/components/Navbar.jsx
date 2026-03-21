import { useEffect, useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import { FaBarsStaggered, FaXmark } from "react-icons/fa6";
import {
  getAuth,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useMyContext } from "../Context/MyContext";
import Cart from "./Cart";
import cedarLogo from "../assets/cedarLogo.jpeg";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  const { cart, toggleCart, isCartOpen } = useMyContext();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleToggleCart = () => {
    toggleCart();
    if (isMenuOpen) setIsMenuOpen(false);
  };

  const handleScrollAdjust = (e, path) => {
    e.preventDefault();

    if (path === "profile") {
      setShowSignInModal(true);
      if (isMenuOpen) setIsMenuOpen(false);
      return;
    }

    const target = document.getElementById(path);
    if (target) {
      const offset = 100;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
      if (isMenuOpen) setIsMenuOpen(false);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (userCredential.user) {
        toast.success("Signed in successfully!");
        setShowSignInModal(false);

        const target = document.getElementById("Equipment");
        if (target) {
          const offset = 100;
          const top = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top, behavior: "smooth" });
        }
      }
    } catch {
      toast.error("Bad user credentials");
    }
  };

  const handleForgotPassword = async () => {
    if (!email) return toast.warn("Enter your email to reset password");
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent");
    } catch {
      toast.error("Failed to send reset email");
    }
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => toast.info("Logged out"))
      .catch(() => toast.error("Logout failed"));
  };

  const navItems = [
    { link: "Home", path: "home" },
    { link: "Dishes", path: "dishes" },
    { link: "About", path: "about" },
    { link: "Services", path: "services" },
    { link: "Orders", path: "orders" },
    { link: "Payment", path: "payment" },
    { link: "Profile", path: "profile" },
    { link: "Contact", path: "contact" },
  ];

  const username = currentUser?.email?.split("@")[0];

  return (
    <>
      <ToastContainer />

      <header className="fixed w-full z-50 transition-all duration-300">
        <nav
          className={`py-4 lg:px-24 px-4 ${
            isSticky ? "bg-white shadow-lg" : "bg-white"
          }`}
        >
          <div className="flex justify-between items-center text-base relative">
            <a href="/" className="flex items-center gap-3">
              <img
                src={cedarLogo}
                alt="Cedar Logo"
                className="h-16 w-16 object-contain rounded-full p-1 bg-white shadow-md ring-2 ring-white/70"
              />
              {/* <div className="flex flex-col leading-tight">
                <span className="text-lg md:text-xl font-bold text-blue-900 uppercase">
                  Cedar
                </span>
              </div> */}
            </a>

            <div className="hidden md:flex items-center space-x-8">
              <ul className="flex space-x-8 items-center">
                {navItems.map(({ link, path }) => {
                  if (path === "profile" && currentUser) {
                    return (
                      <div key="user-info" className="ml-4 flex flex-col items-start">
                        <span className="text-sm text-gray-700 flex items-center gap-1">
                          👤 {username}
                        </span>
                        <button
                          onClick={handleLogout}
                          className="text-xs text-blue-900 hover:text-blue-700 mt-1"
                          type="button"
                        >
                          Logout
                        </button>
                      </div>
                    );
                  }

                  return (
                    <a
                      key={link}
                      href={`#${path}`}
                      onClick={(e) => handleScrollAdjust(e, path)}
                      className="text-base uppercase text-[#181818] hover:text-blue-900 cursor-pointer transition"
                    >
                      {link}
                    </a>
                  );
                })}
              </ul>

              <div onClick={handleToggleCart} className="relative cursor-pointer ml-4">
                <FaShoppingCart className="text-2xl text-blue-900" />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-blue-900 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                    {cart.length}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center md:hidden gap-3">
              <div onClick={handleToggleCart} className="relative cursor-pointer mr-1">
                <FaShoppingCart className="text-2xl text-blue-900" />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-blue-900 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                    {cart.length}
                  </span>
                )}
              </div>

              <button
                onClick={toggleMenu}
                className="p-2 border border-blue-900 rounded-full"
                type="button"
              >
                {isMenuOpen ? (
                  <FaXmark className="h-6 w-6 text-blue-900" />
                ) : (
                  <FaBarsStaggered className="h-6 w-6 text-blue-900" />
                )}
              </button>
            </div>
          </div>

          <div
            className={`md:hidden fixed top-0 left-0 w-full h-screen bg-[#172554] transition-transform transform ${
              isMenuOpen ? "translate-y-0" : "-translate-y-full"
            } px-4`}
          >
            <div className="flex justify-between items-center p-4 border-b border-white/10">
              <a href="/" className="flex items-center gap-3">
                <img
                  src={cedarLogo}
                  alt="Cedar Logo"
                  className="h-11 w-11 object-contain rounded-full p-1 bg-white shadow-md ring-2 ring-white/70"
                />
                {/* <span className="text-white text-lg font-bold uppercase">Cedar</span> */}
              </a>

              <button
                onClick={toggleMenu}
                className="text-white p-2 border border-white/30 rounded-full"
                type="button"
              >
                <FaXmark className="h-6 w-6 text-white" />
              </button>
            </div>

            <ul className="flex flex-col items-center justify-center mt-12 space-y-6">
              {navItems.map(({ link, path }) => {
                if (path === "profile" && currentUser) {
                  return (
                    <span
                      key="user"
                      className="text-base uppercase text-white font-semibold flex items-center gap-1"
                    >
                      👤 {username}
                    </span>
                  );
                }

                return (
                  <a
                    key={link}
                    href={`#${path}`}
                    onClick={(e) => handleScrollAdjust(e, path)}
                    className="text-base uppercase text-white hover:text-gray-300 cursor-pointer transition"
                  >
                    {link}
                  </a>
                );
              })}

              {currentUser && (
                <button
                  onClick={handleLogout}
                  className="text-gray-300 hover:text-white transition mt-2"
                  type="button"
                >
                  Logout
                </button>
              )}
            </ul>
          </div>
        </nav>
      </header>

      {isCartOpen && <Cart />}

      {showSignInModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4">
          <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <button
              onClick={() => setShowSignInModal(false)}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-800"
              type="button"
            >
              <FaXmark className="h-5 w-5" />
            </button>

            <div className="mb-6 text-center">
              <img
                src={cedarLogo}
                alt="Cedar Logo"
                className="mx-auto h-16 w-16 object-contain rounded-full p-1 bg-white shadow-md ring-2 ring-white/70"
              />
              <h2 className="mt-3 text-2xl font-bold text-[#181818]">Sign In</h2>
              <p className="text-sm text-gray-500">Access your Cedar account</p>
            </div>

            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-900"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-12 outline-none focus:border-blue-900"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-blue-900 py-3 font-semibold text-white transition hover:bg-blue-800"
              >
                Sign In
              </button>

              <button
                type="button"
                onClick={handleForgotPassword}
                className="w-full text-sm font-medium text-blue-900 hover:underline"
              >
                Forgot Password?
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;