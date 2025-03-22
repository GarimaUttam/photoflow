"use client";
import Image from "next/image";
import React, { ChangeEvent, FormEvent, useState } from "react";
import PasswordInput from "./PasswordInput";
import LoadingButton from "../Helper/LoadingButton";
import Link from "next/link";
import { BASE_API_URL } from "../../../server";
import axios from "axios";
import { handleAuthRequest } from "../utils/apiRequest";
import { toast } from "sonner";

interface FormData {
  username: string;
  email: string;
  password: string;
  passwordConfirm: string;
}


const Signup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });


  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }))
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // create our request body
    const signupReq = async () => await axios.post(`${BASE_API_URL}/users/signup`, formData, { withCredentials: true });
    
    const result = await handleAuthRequest(signupReq, setIsLoading);

    if (result) {
      console.log(result.data.data.user);
      toast.success(result.data.message);
    }
  };````````````````````
  
  return (
    <div className="w-full h-screen overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-8">
        {/* Banner */}
        <div className="lg:col-span-4 h-screen hidden lg:block">
          <Image
            src="/images/signUpImg.jpg"
            alt=""
            width={1000}
            height={1000}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Form */}
        <div className="lg:col-span-3 flex flex-col items-center justify-center h-screen">
          <h1 className="font-bold text-xl sm:text-2xl text-left uppercase mb-8 ">
            Sign Up with
            {/* <Image
              src="/images/logo.svg"
              alt="Photoflow"
              width={400}
              height={40}
              className="w-[400px] h-auto inline-block !m-0 !p-0"
            /> */}
            <span className="text-rose-500"> Photoflow</span>
          </h1>
          <form onSubmit={handleSubmit} className="block w-[90%] sm:w-[80%] md:w-[60%] lg:w-[90%] xl:w-[80%] ">
            <div className="mb-4">
              <label htmlFor="name" className="font-semibold mb-2 block">
                Username
              </label>
              <input
                type="text"
                name="username"
                placeholder="Username"
                className="px-4 py-3 bg-gray-200 rounded-lg w-full block outline-none"
                value={formData.username}
                onChange={handleChange}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="name" className="font-semibold mb-2 block">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="Email address"
                className="px-4 py-3 bg-gray-200 rounded-lg w-full block outline-none"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="mb-4">
              <PasswordInput
                label="Password"
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <PasswordInput
                label="Password Confirm"
                name="passwordConfirm" // Change from "Confirm password"
                placeholder="Confirm password"
                value={formData.passwordConfirm}
                onChange={handleChange}
              />
            </div>

            <LoadingButton
              size={"lg"}
              className="w-full mt-3"
              type="submit"
              isLoading={isLoading}
            >
              Sign Up Now
            </LoadingButton>
          </form>
          <h1 className="mt-4 text-lg text-gray-800">
            Already have account?{" "}
            <Link href="/auth/login">
              <span className="text-blue-800 underline cursor-pointer font-medium">
                Login Here
              </span>{" "}
            </Link>
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Signup;
