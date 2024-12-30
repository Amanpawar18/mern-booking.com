import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";
import { useNavigate } from "react-router-dom";

export type RegisterFormData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const Register = () => {
  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>();

  const { showToast } = useAppContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation(apiClient.register, {
    onSuccess: async () => {
      await queryClient.invalidateQueries("validateToken");
      showToast({ message: "Registration successfull !!", type: "SUCCESS" });
      navigate("/");
    },
    onError: (error: Error) => {
      showToast({ message: error.message, type: "ERROR" });
    },
  });

  const onSubmit = handleSubmit((data) => {
    mutation.mutate(data);
  });

  return (
    <form className="flex flex-col gap-5" onSubmit={onSubmit}>
      <h2 className="text-3xl font-bold">Create an account</h2>
      <div className="flex flex-col md:flex-row gap-5">
        <label
          className="text-gray-700 text-sm font-bold flex-1"
          htmlFor="firstName"
        >
          First Name
          <input
            className="border rounded w-full py-1 px-2 font-normal"
            id="firstName"
            {...register("firstName", { required: "This field is required" })}
          ></input>
          {errors.firstName && (
            <span className="text-red-500">{errors.firstName.message}</span>
          )}
        </label>
        <label
          className="text-gray-700 text-sm font-bold flex-1"
          htmlFor="lastName"
        >
          Last Name
          <input
            className="border rounded w-full py-1 px-2 font-normal"
            id="lastName"
            {...register("lastName", { required: "This field is required" })}
          ></input>
          {errors.lastName && (
            <span className="text-red-500">{errors.lastName.message}</span>
          )}
        </label>
      </div>
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
      <label
        className="text-gray-700 text-sm font-bold flex-1"
        htmlFor="confirmPassword"
      >
        Confirm Password
        <input
          type="confirmPassword"
          className="border rounded w-full py-1 px-2 font-normal"
          id="confirmPassword"
          {...register("confirmPassword", {
            validate: (val) => {
              if (!val) return "This field is required";
              else if (watch("password") != val)
                return "Your password do not match.";
            },
          })}
        ></input>
        {errors.confirmPassword && (
          <span className="text-red-500">{errors.confirmPassword.message}</span>
        )}
      </label>
      <span>
        <button className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-white">
          Register
        </button>
      </span>
    </form>
  );
};

export default Register;
