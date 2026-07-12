import React, { useState } from "react";
import { Leaf, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { loginUser } from "../../api/authApi";

export default function Login({ onLoginSuccess = () => {}, onNavigateToRegister = () => {} }) {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError("");
  };

  const validate = () => {
    if (!formData.email.trim()) return "Enter your email.";
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) return "Enter a valid email address.";
    if (!formData.password) return "Enter your password.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await loginUser(formData);
      // Expecting { token, user } from backend
      localStorage.setItem("token", res.data.token);
      onLoginSuccess(res.data.user);
    } catch (err) {
      setError(
        err.response?.data?.message || "Couldn't sign in. Check your credentials and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0e0f13] px-4">
      <div className="w-full max-w-sm">
        {/* Brand */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-3">
            <Leaf size={22} className="text-emerald-400" />
          </div>
          <h1 className="text-lg font-semibold text-white">Welcome back</h1>
          <p className="text-[13px] text-slate-500 mt-1">Sign in to your ESG dashboard</p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {error && (
            <div className="text-[13px] text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-[12.5px] font-medium text-slate-400 mb-1.5">
              Email
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@company.com"
                autoComplete="email"
                className="w-full bg-white/[0.04] border border-white/10 rounded-lg pl-9 pr-3 py-2.5 text-[14px] text-white placeholder-slate-600 outline-none focus:border-emerald-500/50 focus:bg-white/[0.06] transition-colors"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[12.5px] font-medium text-slate-400">
                Password
              </label>
              <button
                type="button"
                className="text-[12px] text-emerald-400 hover:text-emerald-300"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                autoComplete="current-password"
                className="w-full bg-white/[0.04] border border-white/10 rounded-lg pl-9 pr-9 py-2.5 text-[14px] text-white placeholder-slate-600 outline-none focus:border-emerald-500/50 focus:bg-white/[0.06] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-400"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 disabled:cursor-not-allowed text-[#0e0f13] font-semibold text-[14px] rounded-lg py-2.5 transition-colors flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="text-center text-[13px] text-slate-500 mt-6">
          Don't have an account?{" "}
          <button
            onClick={onNavigateToRegister}
            className="text-emerald-400 hover:text-emerald-300 font-medium"
          >
            Create one
          </button>
        </p>
      </div>
    </div>
  );
}