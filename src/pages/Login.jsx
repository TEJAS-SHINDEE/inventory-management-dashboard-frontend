import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Login() {
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const email = result.user.email;

      const res = await axios.post("https://inventory-management-dashboard-backend-7tx4.onrender.com/api/auth/google-login", { email });
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      console.error("Google Login Error:", err);
      alert("Google login failed");
    }
  };

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    const url = isRegistering
      ? "https://inventory-management-dashboard-backend-7tx4.onrender.com/api/auth/register"
      : "https://inventory-management-dashboard-backend-7tx4.onrender.com/api/auth/login";

    try {
      const res = await axios.post(url, form);
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      alert(err?.response?.data?.message || "Auth failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md space-y-6">
        <h1 className="text-2xl font-bold text-center">Inventory Management Dashboard</h1>
        <p className="pb-2 text-center font-semibold text-black">Welcome</p>
        <p className="pb-2 text-center text-black text-sm">
          <span className="bg-white px-1 font-bold text-[#00C4A7]">please enter credentials to enter into</span><br /> inventory management.
        </p>
        {/* Google Login */}
        <button
          onClick={handleGoogleLogin}
          className="mb-6 my-4 flex place-self-center items-center justify-around rounded-lg border border-neutral-700 font-semibold hover:bg-neutral-200 "        >
          <p className="ml-2 flex w-full items-center gap-2 p-2">     <img className="h-10 w-10" src="./google.png" alt="google png " />     Sign in with Google</p>
        </button>

        <div className=" relative my-4 flex flex-row items-center justify-center">
          <hr className="relative w-full" />
          <p className=" absolute rounded-sm bg-black px-2 py-1 font-medium text-white text-xs">
            OR CONTINUE WITH
          </p>
        </div>


        {/* Email Login/Register Form */}
        <form onSubmit={handleEmailAuth} className="space-y-3 mt-6">
          <label htmlFor="email">Enter email : </label>
          <input
            type="email"
            name="email"
            placeholder="please enter email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <label htmlFor="password">Enter password : </label>
          <input
            type="password"
            name="password"
            placeholder="please enter password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            {isRegistering ? "sign up" : "sign in "}
          </button>
        </form>

        <p className="text-center text-sm">
          {isRegistering ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-blue-600 underline"
          >
            {isRegistering ? "sign in" : "sign up"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;
