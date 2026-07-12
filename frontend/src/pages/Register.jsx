import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Loader2, ArrowRight, Leaf } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


export default function Register() {

  const { register } = useAuth();

  const navigate = useNavigate();


  const [loading, setLoading] = useState(false);


  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "employee",
    department: "",
  });



  const handleChange = (e) => {

    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));

  };



  const handleSubmit = async (e) => {

    e.preventDefault();


    if (
      !form.name ||
      !form.email ||
      !form.password ||
      !form.department
    ) {

      toast.error("Please fill all fields");
      return;

    }


    setLoading(true);


    try {


      await register({
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
        department: form.department,
      });



      toast.success(
        "Account created successfully"
      );


      navigate("/login", {
        replace: true,
      });


    } catch (error) {


      toast.error(
        error?.response?.data?.message ||
        "Registration failed"
      );


    } finally {

      setLoading(false);

    }

  };



  return (

    <div className="min-h-screen w-full grid lg:grid-cols-2 bg-background">


      {/* LEFT BRAND PANEL */}

      <div
        className="
        hidden lg:flex
        flex-col
        justify-between
        bg-emerald-900
        text-white
        p-10
        relative
        overflow-hidden
        "
      >


        <div
          className="
          absolute
          -top-24
          -right-24
          size-96
          rounded-full
          bg-green-400/20
          blur-3xl
          "
        />


        <div
          className="
          absolute
          bottom-0
          left-0
          size-72
          rounded-full
          bg-emerald-400/20
          blur-3xl
          "
        />



        <div className="relative flex items-center gap-3">


          <div
            className="
            flex
            size-10
            items-center
            justify-center
            rounded-xl
            bg-green-500
            "
          >

            <Leaf className="size-5" />

          </div>


          <div>

            <h1 className="font-bold text-xl">

              Eco
              <span className="text-green-300">
                Sphere
              </span>

            </h1>


            <p className="text-xs text-green-100">
              ESG Management Platform
            </p>


          </div>


        </div>





        <div className="relative max-w-md">


          <h1
            className="
            text-4xl
            font-bold
            leading-tight
            mb-5
            "
          >

            Build a Sustainable Future Together.

          </h1>



          <p className="text-green-100 leading-relaxed">

            Manage carbon emissions,
            CSR activities, compliance,
            and employee sustainability
            initiatives from one platform.

          </p>




          <div className="grid grid-cols-2 gap-4 mt-10">


            <div className="bg-white/10 rounded-xl p-4">

              <h3 className="text-2xl font-bold">
                12K+
              </h3>

              <p className="text-sm text-green-100">
                CO₂ Tracked
              </p>

            </div>



            <div className="bg-white/10 rounded-xl p-4">

              <h3 className="text-2xl font-bold">
                250+
              </h3>

              <p className="text-sm text-green-100">
                CSR Activities
              </p>

            </div>


          </div>


        </div>



        <p className="text-xs text-green-100/70">

          EcoSphere • ESG Management Platform

        </p>


      </div>






      {/* REGISTER FORM */}


      <div
        className="
        flex
        items-center
        justify-center
        p-6
        sm:p-10
        "
      >


        <div
          className="
          w-full
          max-w-md
          space-y-8
          "
        >



          <div>


            <h2 className="text-3xl font-bold">

              Create Account

            </h2>


            <p className="text-muted-foreground mt-2">

              Join EcoSphere and manage sustainability goals.

            </p>


          </div>





          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >



            <div className="space-y-2">


              <Label>
                Full Name
              </Label>


              <Input

                name="name"

                placeholder="Shardul Mane"

                value={form.name}

                onChange={handleChange}

                required

              />


            </div>





            <div className="space-y-2">


              <Label>
                Email
              </Label>


              <Input

                type="email"

                name="email"

                placeholder="you@company.com"

                value={form.email}

                onChange={handleChange}

                required

              />


            </div>





            <div className="space-y-2">


              <Label>
                Password
              </Label>


              <Input

                type="password"

                name="password"

                placeholder="******"

                value={form.password}

                onChange={handleChange}

                required

              />


            </div>





            <div className="space-y-2">


              <Label>
                Role
              </Label>


              <Select

                value={form.role}

                onValueChange={(value)=>

                  setForm((prev)=>({
                    ...prev,
                    role:value
                  }))

                }

              >


                <SelectTrigger>

                  <SelectValue />

                </SelectTrigger>


                <SelectContent>


                  <SelectItem value="admin">

                    Admin

                  </SelectItem>


                  <SelectItem value="manager">

                    Manager

                  </SelectItem>


                  <SelectItem value="employee">

                    Employee

                  </SelectItem>


                </SelectContent>


              </Select>


            </div>





            <div className="space-y-2">


              <Label>
                Department ID
              </Label>


              <Input

                name="department"

                placeholder="Enter department id"

                value={form.department}

                onChange={handleChange}

                required

              />


            </div>





            <Button

              className="w-full"

              disabled={loading}

            >


              {

                loading ? (

                  <Loader2 className="size-4 animate-spin"/>

                ) : (

                  <>

                  Create Account

                  <ArrowRight className="ml-2 size-4"/>

                  </>

                )

              }


            </Button>




          </form>





          <p className="text-center text-sm text-muted-foreground">


            Already have an account?{" "}


            <Link

              to="/login"

              className="
              text-primary
              font-medium
              hover:underline
              "
            >

              Login

            </Link>


          </p>



        </div>


      </div>


    </div>

  );

}