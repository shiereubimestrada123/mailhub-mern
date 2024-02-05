import { useRef } from "react";
import axios from "axios";
import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { Button, FormInput } from "@components";
import { useAuthStore } from "@store";
import { post } from "@utils";

type RegisterProps = {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export function Register() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RegisterProps>({
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const setToast = useAuthStore((state) => state.setToast);
  const setIsLogin = useAuthStore((state) => state.setIsLogin);

  const password = useRef<string>("");
  password.current = watch("password", "");

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (newTodo) => {
      return await post("/register", newTodo);
    },
  });

  const onSubmit: SubmitHandler<RegisterProps> = async (data) => {
    try {
      const response = await mutateAsync(data as any);
      setToast(response);
      setIsLogin(true);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) setToast(error?.response?.data);
    } finally {
      reset();
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormInput
          htmlFor="firstName"
          labelText="First Name"
          id="firstName"
          type="text"
          placeholder="Enter your first name"
          classLabel="w-full max-w-xs form-control"
          classInput="w-full max-w-xs input input-bordered"
          register={register("firstName", {
            required: {
              value: true,
              message: "First name is required",
            },
            pattern: /^[a-zA-Z ]+$/,
          })}
          errorRequired={
            errors.firstName?.type === "required" && errors.firstName?.message
          }
          errorPattern={
            errors.firstName?.type === "pattern" && "Invalid First Name"
          }
        />
        <FormInput
          htmlFor="middleName"
          labelText="Middle Name"
          id="middleName"
          type="text"
          placeholder="Enter your middle name"
          classLabel="w-full max-w-xs form-control"
          classInput="w-full max-w-xs input input-bordered"
          register={register("middleName", {
            pattern: /^[a-zA-Z ]+$/,
          })}
          errorPattern={
            errors.middleName?.type === "pattern" && "Invalid Middle Name"
          }
        />
        <FormInput
          htmlFor="lastName"
          labelText="Last Name"
          id="lastName"
          type="text"
          placeholder="Enter your last name"
          classLabel="w-full max-w-xs form-control"
          classInput="w-full max-w-xs input input-bordered"
          register={register("lastName", {
            required: {
              value: true,
              message: "Last name is required",
            },
            pattern: /^[a-zA-Z ]+$/,
          })}
          errorRequired={
            errors.lastName?.type === "required" && errors.lastName?.message
          }
          errorPattern={
            errors.lastName?.type === "pattern" && "Invalid Last Name"
          }
        />
        <FormInput
          htmlFor="email"
          labelText="Email"
          id="email"
          type="email"
          placeholder="Enter your email"
          classLabel="w-full max-w-xs form-control"
          classInput="w-full max-w-xs input input-bordered"
          register={register("email", {
            required: {
              value: true,
              message: "Email is required",
            },
            pattern:
              /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          })}
          errorRequired={
            errors.email?.type === "required" && errors.email?.message
          }
          errorPattern={errors.email?.type === "pattern" && "Invalid email"}
        />
        <FormInput
          htmlFor="password"
          labelText="Password"
          id="password"
          type="password"
          placeholder="Enter your password"
          classLabel="w-full max-w-xs form-control"
          classInput="w-full max-w-xs input input-bordered"
          register={register("password", {
            required: {
              value: true,
              message: "Password is required",
            },
            minLength: 7,
          })}
          errorRequired={
            errors.password?.type === "required" && errors.password?.message
          }
          errorMinLength={
            errors.password?.type === "minLength" &&
            "Must be at least 7 characters"
          }
        />
        <FormInput
          htmlFor="confirmPassword"
          labelText="Confirm Password"
          id="confirmPassword"
          type="password"
          placeholder="Enter again your password"
          classLabel="w-full max-w-xs form-control"
          classInput="w-full max-w-xs input input-bordered"
          register={register("confirmPassword", {
            required: {
              value: true,
              message: "Password confirmation is required",
            },
            validate: (value) =>
              value === password.current || "Passwords do not match",
          })}
          errorRequired={
            errors.confirmPassword?.type === "required" &&
            errors.confirmPassword?.message
          }
          errorValidate={
            errors.confirmPassword?.type === "validate" &&
            "Passwords do not match"
          }
        />
        <Button
          type="submit"
          className="my-3 text-slate-100 btn btn-block btn-active btn-primary"
          disabled={isSubmitting || isPending}
        >
          Register
        </Button>
      </form>
    </>
  );
}
