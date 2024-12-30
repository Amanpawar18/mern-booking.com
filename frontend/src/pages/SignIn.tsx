import React from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import { signIn } from "../api-client";
import { useAppContext } from "../contexts/AppContext";
import { Link, useLocation, useNavigate } from "react-router-dom";

export type SignInFormData = {
  email: string;
  password: string;
};

const SignIn = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>();

  const location = useLocation()

  const queryClient = useQueryClient();

  const mutation = useMutation(signIn, {
    onSuccess: async () => {
      await queryClient.invalidateQueries("validateToken");

      showToast({ message: "Sign In successfull !!", type: "SUCCESS" });

      navigate(location.state?.from?.pathname || "/");
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: "ERROR" });
    },
  });
  const { showToast } = useAppContext();
  const navigate = useNavigate();

  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data);
  });

  return (
    <form className="flex flex-col gap-5" onSubmit={onSubmit}>
      <h2 className="text-3xl font-bold">Sign In</h2>
      <label className="text-gray-700 text-sm font-bold flex-1" htmlFor="email">
        Email
        <input
          type="email"
          className="border rounded w-full py-1 px-2 font-normal"
          id="email"
          {...register("email", { required: "This field is required" })}
        ></input>
        {errors.email && (
          <span className="text-red-500">{errors.email.message}</span>
        )}
      </label>
      <label
        className="text-gray-700 text-sm font-bold flex-1"
        htmlFor="password"
      >
        Password
        <input
          type="password"
          className="border rounded w-full py-1 px-2 font-normal"
          id="password"
          {...register("password", {
            required: "This field is required",
            minLength: { value: 6, message: "Password must be 6 length" },
          })}
        ></input>
        {errors.password && (
          <span className="text-red-500">{errors.password.message}</span>
        )}
      </label>
      <span className="flex items0center justify-between">
        <span className="text-sm">
          Not regiseterd?
          <Link to="/register" className="underline ml-1">Create account here..</Link>
        </span>
        <button className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-white">
          Sign in
        </button>
      </span>
    </form>
  );
};

export default SignIn;
