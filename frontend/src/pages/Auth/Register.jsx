import { useState } from "react";
import {
  Leaf,
  Mail,
  Lock,
  User,
  Building2,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { registerUser } from "../../api/authApi";

const DEPARTMENTS = [
  "Sustainability",
  "Operations",
  "HR",
  "Finance",
  "Engineering",
  "Other",
];

export default function Register({
  onRegisterSuccess = () => {},
  onNavigateToLogin = () => {},
}) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    department: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    if (serverError) setServerError("");
  };

  const validate = () => {
    const next = {};

    if (!formData.name.trim())
      next.name = "Enter your full name.";

    if (!formData.email.trim())
      next.email = "Enter your email.";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email))
      next.email = "Enter a valid email address.";

    if (!formData.password)
      next.password = "Enter a password.";
    else if (formData.password.length < 8)
      next.password = "Use at least 8 characters.";

    if (formData.confirmPassword !== formData.password)
      next.confirmPassword = "Passwords don't match.";

    if (!formData.department)
      next.department = "Select a department.";

    return next;
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  const validationErrors = validate();

  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    return;
  }

  setLoading(true);
  setServerError("");

  try {
    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      department: formData.department,
    };

    const res = await registerUser(payload);
    onRegisterSuccess(res.data.user);
  } catch (err) {
    setServerError(
      err.response?.data?.message ||
        "Couldn't create your account. Try again."
    );
  } finally {
    setLoading(false);
  }
};

  const fieldClass = (field) =>
    `w-full bg-white/[0.04] border rounded-lg pl-9 pr-3 py-2.5 text-[14px] text-white placeholder-slate-600 outline-none transition-colors ${
      errors[field]
        ? "border-red-500/50 focus:border-red-500/70"
        : "border-white/10 focus:border-emerald-500/50 focus:bg-white/[0.06]"
    }`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0e0f13] px-4 py-10">
      <div className="w-full max-w-sm">

        <div className="flex flex-col items-center mb-8">
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-3">
            <Leaf className="text-emerald-400" size={22} />
          </div>

          <h1 className="text-lg font-semibold text-white">
            Create your account
          </h1>

          <p className="text-[13px] text-slate-500 mt-1">
            Start tracking your ESG impact
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">

          {serverError && (
            <div className="text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 text-sm">
              {serverError}
            </div>
          )}

          {/* Name */}

          <div>
            <label className="block text-slate-400 text-sm mb-1">
              Full Name
            </label>

            <div className="relative">
              <User
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
              />

              <input
                name="name"
                type="text"
                placeholder="John Doe"
                autoComplete="name"
                value={formData.name}
                onChange={handleChange}
                className={fieldClass("name")}
              />
            </div>

            {errors.name && (
              <p className="text-red-400 text-xs mt-1">
                {errors.name}
              </p>
            )}
          </div>

          {/* Email */}

          <div>
            <label className="block text-slate-400 text-sm mb-1">
              Email
            </label>

            <div className="relative">
              <Mail
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
              />

              <input
                name="email"
                type="email"
                placeholder="name@company.com"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                className={fieldClass("email")}
              />
            </div>

            {errors.email && (
              <p className="text-red-400 text-xs mt-1">
                {errors.email}
              </p>
            )}
          </div>

          {/* Department */}

          <div>
            <label className="block text-slate-400 text-sm mb-1">
              Department
            </label>

            <div className="relative">
              <Building2
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
              />

              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className={`${fieldClass("department")} appearance-none`}
                style={{
                  colorScheme: "dark",
                  backgroundColor: "#14161b",
                  color: "#ffffff",
                }}
              >
                <option
                  value=""
                  disabled
                  style={{ backgroundColor: "#14161b", color: "#94a3b8" }}
                >
                  Select Department
                </option>

                {DEPARTMENTS.map((dept) => (
                  <option
                    key={dept}
                    style={{ backgroundColor: "#14161b", color: "#ffffff" }}
                  >
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {errors.department && (
              <p className="text-red-400 text-xs mt-1">
                {errors.department}
              </p>
            )}
          </div>

          {/* Password */}

          <div>
            <label className="block text-slate-400 text-sm mb-1">
              Password
            </label>

            <div className="relative">
              <Lock
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
              />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="At least 8 characters"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                className={`${fieldClass("password")} pr-9`}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {errors.password && (
              <p className="text-red-400 text-xs mt-1">
                {errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password */}

          <div>
            <label className="block text-slate-400 text-sm mb-1">
              Confirm Password
            </label>

            <div className="relative">
              <Lock
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
              />

              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Re-enter password"
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={fieldClass("confirmPassword")}
              />
            </div>

            {errors.confirmPassword && (
              <p className="text-red-400 text-xs mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <button
            disabled={loading}
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-400 rounded-lg py-2.5 font-semibold text-[#0e0f13] flex justify-center items-center gap-2"
          >
            {loading && <Loader2 className="animate-spin" size={16} />}

            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="text-center text-slate-500 mt-6">
          Already have an account?{" "}
          <button
            onClick={onNavigateToLogin}
            className="text-emerald-400"
          >
            Sign In
          </button>
        </p>

      </div>
    </div>
  );
}