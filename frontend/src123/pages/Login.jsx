
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Loader2, ArrowRight, Leaf } from "lucide-react";
import { toast } from "sonner";

import { useAuth } from "@/context/AuthContext";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Login() {
  const { login } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      await login(form.email, form.password);

      toast.success("Welcome back!");

      navigate(location.state?.from || "/", {
        replace: true,
      });
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Left Section */}
      <div className="hidden lg:flex flex-col justify-between bg-emerald-900 text-white p-12 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 h-80 w-80 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-green-400/20 blur-3xl" />

        <div className="relative flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-500">
            <Leaf className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-2xl font-bold">
              Eco<span className="text-green-300">Sphere</span>
            </h2>
            <p className="text-sm text-green-100">
              ESG Management Platform
            </p>
          </div>
        </div>

        <div className="relative max-w-lg">
          <h1 className="text-5xl font-bold leading-tight mb-6">
            Measure Sustainability.
            <br />
            Drive Impact.
          </h1>

          <p className="text-lg leading-8 text-green-100">
            Monitor carbon emissions, manage CSR initiatives,
            ensure governance compliance, and engage employees
            through one intelligent ESG platform.
          </p>

          <div className="grid grid-cols-2 gap-5 mt-12">
            <div className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <h3 className="text-3xl font-bold">12.5K</h3>
              <p className="text-sm text-green-100">
                Tons CO₂ Tracked
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <h3 className="text-3xl font-bold">250+</h3>
              <p className="text-sm text-green-100">
                CSR Activities
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <h3 className="text-3xl font-bold">90%</h3>
              <p className="text-sm text-green-100">
                ESG Compliance
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur">
              <h3 className="text-3xl font-bold">1800+</h3>
              <p className="text-sm text-green-100">
                Active Employees
              </p>
            </div>
          </div>
        </div>

        <p className="relative text-xs text-green-100/70">
          EcoSphere • ESG Management Platform
        </p>
      </div>

      {/* Right Section */}
      <div className="flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="text-3xl font-bold">
              Welcome Back
            </h2>

            <p className="text-muted-foreground mt-2">
              Sign in to continue managing your ESG initiatives.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div className="space-y-2">
              <Label>Email Address</Label>

              <Input
                type="email"
                name="email"
                placeholder="you@company.com"
                value={form.email}
                onChange={handleChange}
                required
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label>Password</Label>

              <Input
                type="password"
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex justify-end">
              <Link
                to="/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Login
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t"></span>
            </div>

            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                EcoSphere
              </span>
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-primary hover:underline"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}