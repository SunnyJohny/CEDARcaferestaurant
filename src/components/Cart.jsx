import React, { useMemo, useState } from "react";
import { useMyContext } from "../Context/MyContext";
import {
  FaTrash,
  FaMinus,
  FaPlus,
  FaWhatsapp,
  FaCopy,
  FaCheckCircle,
} from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BANK_DETAILS = {
  bankName: "UBA",
  accountName: "Cedar Cafe Restaurant",
  accountNumber: "0123456789", // replace with real account number
};

export const CartItem = ({ id, name, price, quantity = 1 }) => {
  const { increaseQuantity, decreaseQuantity, removeFromCart } = useMyContext();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-[1.6fr_.9fr_.9fr_1fr_auto] gap-3 items-center border border-gray-200 rounded-lg p-3">
      <div>
        <h3 className="text-sm font-semibold text-gray-800">{name}</h3>
      </div>

      <div className="text-sm text-gray-600">₦{Number(price).toLocaleString()}</div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          className="h-7 w-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-700 hover:bg-gray-100"
          onClick={() => decreaseQuantity(id)}
        >
          <FaMinus className="text-xs" />
        </button>

        <p className="text-sm font-medium min-w-[20px] text-center">{quantity}</p>

        <button
          type="button"
          className="h-7 w-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-700 hover:bg-gray-100"
          onClick={() => increaseQuantity(id)}
        >
          <FaPlus className="text-xs" />
        </button>
      </div>

      <div className="text-sm font-semibold text-blue-900">
        ₦{Number(price * quantity).toLocaleString()}
      </div>

      <button
        type="button"
        className="text-blue-900 hover:text-blue-700"
        onClick={() => removeFromCart(id)}
        title="Remove item"
      >
        <FaTrash />
      </button>
    </div>
  );
};

const Cart = () => {
  const { cart, clearCart, toggleCart, capitalizeWords } = useMyContext();

  const [checkoutStep, setCheckoutStep] = useState("cart");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [customer, setCustomer] = useState({
    fullName: "",
    phone: "",
    address: "",
    note: "",
  });

  const overallTotal = useMemo(
    () => cart.reduce((acc, item) => acc + Number(item.price) * Number(item.quantity || 1), 0),
    [cart]
  );

  const numberToWords = (num) => {
    const a = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];
    const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

    const convertWholeNumber = (n) => {
      if (n < 20) return a[n];
      if (n < 100) return `${b[Math.floor(n / 10)]} ${a[n % 10]}`.trim();
      if (n < 1000) return `${a[Math.floor(n / 100)]} Hundred ${convertWholeNumber(n % 100)}`.trim();
      if (n < 1000000) {
        return `${convertWholeNumber(Math.floor(n / 1000))} Thousand ${convertWholeNumber(n % 1000)}`.trim();
      }
      if (n < 1000000000) {
        return `${convertWholeNumber(Math.floor(n / 1000000))} Million ${convertWholeNumber(n % 1000000)}`.trim();
      }
      return "Amount too large";
    };

    const [wholePart, koboPart] = Number(num).toFixed(2).split(".");
    const wholePartWords = convertWholeNumber(Number(wholePart));
    const koboWords = Number(koboPart) > 0 ? ` and ${convertWholeNumber(Number(koboPart))} Kobo` : "";
    return `${wholePartWords} Naira${koboWords}`.trim();
  };

  const orderLines = cart
    .map(
      (item, index) =>
        `${index + 1}. ${capitalizeWords ? capitalizeWords(item.name) : item.name} - ₦${(
          Number(item.price) * Number(item.quantity || 1)
        ).toLocaleString()} (${item.quantity}x)`
    )
    .join("\n");

  const orderSummaryText = `
CEDAR CAFE RESTAURANT - ORDER SUMMARY

Customer Name: ${customer.fullName || "-"}
Phone Number: ${customer.phone || "-"}
Delivery Address: ${customer.address || "-"}
Customer Note: ${customer.note || "-"}

Items:
${orderLines || "No items"}

Total: ₦${overallTotal.toLocaleString()}
In Words: ${numberToWords(overallTotal)}

PAYMENT DETAILS
Bank: ${BANK_DETAILS.bankName}
Account Name: ${BANK_DETAILS.accountName}
Account Number: ${BANK_DETAILS.accountNumber}
`.trim();

  const whatsappOrderText = `
Hello Cedar Cafe Restaurant,

I have made an order and I want to confirm payment.

Customer Name: ${customer.fullName || "-"}
Phone Number: ${customer.phone || "-"}
Delivery Address: ${customer.address || "-"}
Customer Note: ${customer.note || "-"}

Order Details:
${orderLines || "No items"}

Total Amount: ₦${overallTotal.toLocaleString()}
In Words: ${numberToWords(overallTotal)}

Payment Bank: ${BANK_DETAILS.bankName}
Account Name: ${BANK_DETAILS.accountName}
Account Number: ${BANK_DETAILS.accountNumber}

I will send my payment proof shortly.
`.trim();

  const handleCopy = async (value, label) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(`${label} copied`);
    } catch {
      toast.error(`Failed to copy ${label.toLowerCase()}`);
    }
  };

  const handleProceedToCheckout = () => {
    if (!cart.length) {
      toast.warn("Your cart is empty");
      return;
    }
    setCheckoutStep("details");
  };

  const handleContinueToPayment = () => {
    if (!customer.fullName.trim()) {
      toast.warn("Please enter your full name");
      return;
    }
    if (!customer.phone.trim()) {
      toast.warn("Please enter your phone number");
      return;
    }
    if (!customer.address.trim()) {
      toast.warn("Please enter your delivery address");
      return;
    }

    setCheckoutStep("payment");
  };

  const handleOpenWhatsApp = () => {
    if (!cart.length) {
      toast.warn("Your cart is empty");
      return;
    }

    setIsSubmitting(true);
    const whatsappUrl = `https://wa.me/2349165961843?text=${encodeURIComponent(
      whatsappOrderText
    )}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");

    setTimeout(() => {
      setIsSubmitting(false);
    }, 800);
  };

  return (
    <div className="fixed right-0 top-0 w-full sm:w-[430px] h-full bg-white shadow-2xl z-50 overflow-y-auto transition-transform transform duration-300 ease-in-out">
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-4 border-b border-gray-200 sticky top-0 bg-white z-10">
        <div>
          <h2 className="text-xl font-bold text-blue-900">Checkout</h2>
          <p className="text-xs text-gray-500">
            Cart, payment details, and WhatsApp confirmation
          </p>
        </div>

        <button
          onClick={toggleCart}
          className="text-gray-500 hover:text-blue-900 text-2xl font-bold"
          type="button"
        >
          &times;
        </button>
      </div>

      <div className="px-4 py-4">
        {/* Steps */}
        <div className="grid grid-cols-3 gap-2 mb-6 text-xs text-center">
          <div
            className={`rounded-full px-3 py-2 font-semibold ${
              checkoutStep === "cart" ? "bg-blue-900 text-white" : "bg-blue-50 text-blue-900"
            }`}
          >
            1. Cart
          </div>
          <div
            className={`rounded-full px-3 py-2 font-semibold ${
              checkoutStep === "details" ? "bg-blue-900 text-white" : "bg-blue-50 text-blue-900"
            }`}
          >
            2. Details
          </div>
          <div
            className={`rounded-full px-3 py-2 font-semibold ${
              checkoutStep === "payment" ? "bg-blue-900 text-white" : "bg-blue-50 text-blue-900"
            }`}
          >
            3. Payment
          </div>
        </div>

        {/* CART STEP */}
        {checkoutStep === "cart" && (
          <>
            <div className="mb-3 grid grid-cols-4 sm:grid-cols-[1.6fr_.9fr_.9fr_1fr] gap-3 text-xs font-bold text-gray-600 px-1">
              <span>Name</span>
              <span>Price</span>
              <span>Qty</span>
              <span>Total</span>
            </div>

            <div className="flex flex-col gap-3">
              {cart.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
                  <p className="text-gray-500">Your cart is empty.</p>
                </div>
              ) : (
                cart.map((item) => <CartItem key={item.id} {...item} />)
              )}
            </div>

            <div className="mt-6 border border-blue-100 bg-blue-50 rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-1">Order Total</p>
              <p className="text-2xl font-bold text-blue-900">
                ₦{overallTotal.toLocaleString()}
              </p>
              <p className="text-xs text-gray-600 mt-1">{numberToWords(overallTotal)}</p>
            </div>

            <div className="flex flex-wrap gap-3 mt-5">
              <button
                type="button"
                className="flex-1 bg-blue-900 text-white px-4 py-3 rounded-md hover:bg-blue-800 transition font-medium"
                onClick={handleProceedToCheckout}
              >
                Proceed to Checkout
              </button>

              <button
                type="button"
                className="px-4 py-3 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
                onClick={clearCart}
              >
                Clear
              </button>
            </div>
          </>
        )}

        {/* DETAILS STEP */}
        {checkoutStep === "details" && (
          <>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={customer.fullName}
                  onChange={(e) =>
                    setCustomer((prev) => ({ ...prev, fullName: e.target.value }))
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-900"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={customer.phone}
                  onChange={(e) =>
                    setCustomer((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-900"
                  placeholder="Enter your phone number"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Address
                </label>
                <textarea
                  rows="3"
                  value={customer.address}
                  onChange={(e) =>
                    setCustomer((prev) => ({ ...prev, address: e.target.value }))
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-900"
                  placeholder="Enter your delivery address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Extra Note
                </label>
                <textarea
                  rows="3"
                  value={customer.note}
                  onChange={(e) =>
                    setCustomer((prev) => ({ ...prev, note: e.target.value }))
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-900"
                  placeholder="Any special instruction?"
                />
              </div>
            </div>

            <div className="mt-6 border border-blue-100 bg-blue-50 rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-1">Amount to Pay</p>
              <p className="text-2xl font-bold text-blue-900">
                ₦{overallTotal.toLocaleString()}
              </p>
            </div>

            <div className="flex gap-3 mt-5">
              <button
                type="button"
                className="px-4 py-3 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
                onClick={() => setCheckoutStep("cart")}
              >
                Back
              </button>

              <button
                type="button"
                className="flex-1 bg-blue-900 text-white px-4 py-3 rounded-md hover:bg-blue-800 transition font-medium"
                onClick={handleContinueToPayment}
              >
                Continue to Payment
              </button>
            </div>
          </>
        )}

        {/* PAYMENT STEP */}
        {checkoutStep === "payment" && (
          <>
            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <FaCheckCircle className="text-blue-900" />
                <h3 className="text-lg font-bold text-blue-900">Bank Transfer Payment</h3>
              </div>

              <p className="text-sm text-gray-700 mb-4">
                Make payment to the account below, then continue to WhatsApp to send
                your order and payment proof.
              </p>

              <div className="space-y-3">
                <div className="bg-white border border-gray-200 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Bank Name</p>
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-gray-800">{BANK_DETAILS.bankName}</p>
                    <button
                      type="button"
                      className="text-blue-900 hover:text-blue-700"
                      onClick={() => handleCopy(BANK_DETAILS.bankName, "Bank name")}
                    >
                      <FaCopy />
                    </button>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Account Name</p>
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold text-gray-800">{BANK_DETAILS.accountName}</p>
                    <button
                      type="button"
                      className="text-blue-900 hover:text-blue-700"
                      onClick={() => handleCopy(BANK_DETAILS.accountName, "Account name")}
                    >
                      <FaCopy />
                    </button>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Account Number</p>
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xl font-bold tracking-widest text-blue-900">
                      {BANK_DETAILS.accountNumber}
                    </p>
                    <button
                      type="button"
                      className="text-blue-900 hover:text-blue-700"
                      onClick={() => handleCopy(BANK_DETAILS.accountNumber, "Account number")}
                    >
                      <FaCopy />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-gray-200 p-4 mb-4">
              <h3 className="text-base font-bold text-gray-800 mb-3">Order Summary</h3>

              <div className="space-y-2 mb-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-start justify-between gap-3 text-sm">
                    <p className="text-gray-700">
                      {capitalizeWords ? capitalizeWords(item.name) : item.name}{" "}
                      <span className="text-gray-500">x{item.quantity}</span>
                    </p>
                    <p className="font-medium text-blue-900">
                      ₦{(Number(item.price) * Number(item.quantity || 1)).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t pt-3">
                <p className="text-sm text-gray-500">Customer</p>
                <p className="text-sm text-gray-800">{customer.fullName}</p>
                <p className="text-sm text-gray-800">{customer.phone}</p>
                <p className="text-sm text-gray-800">{customer.address}</p>

                {customer.note && (
                  <p className="text-sm text-gray-600 mt-2">Note: {customer.note}</p>
                )}

                <div className="mt-4">
                  <p className="text-sm text-gray-500">Total Amount</p>
                  <p className="text-2xl font-bold text-blue-900">
                    ₦{overallTotal.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">{numberToWords(overallTotal)}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => handleCopy(orderSummaryText, "Order summary")}
                className="w-full border border-blue-900 text-blue-900 px-4 py-3 rounded-md hover:bg-blue-50 transition font-medium flex items-center justify-center gap-2"
              >
                <FaCopy />
                Copy Order Summary
              </button>

              <button
                type="button"
                onClick={handleOpenWhatsApp}
                disabled={isSubmitting}
                className="w-full bg-green-600 text-white px-4 py-3 rounded-md hover:bg-green-700 transition font-medium flex items-center justify-center gap-2 disabled:opacity-70"
              >
                <FaWhatsapp />
                {isSubmitting ? "Opening WhatsApp..." : "Confirm Order on WhatsApp"}
              </button>

              <button
                type="button"
                className="w-full border border-gray-300 text-gray-700 px-4 py-3 rounded-md hover:bg-gray-50 transition"
                onClick={() => setCheckoutStep("details")}
              >
                Back
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;