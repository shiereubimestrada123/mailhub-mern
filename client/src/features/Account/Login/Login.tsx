import axios from "axios";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button, FormInput } from "@components";
import { useMutation } from "@tanstack/react-query";
import { post } from "@utils";
import { useAuthStore } from "@store";

type LoginProps = {
  email: string;
  password: string;
};

export function Login() {
  const navigate = useNavigate();
  const setToast = useAuthStore((state) => state.setToast);
  const setToken = useAuthStore((state) => state.setToken);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoginProps>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (newTodo) => {
      return await post("/login", newTodo);
    },
  });

  const onSubmit: SubmitHandler<LoginProps> = async (data) => {
    try {
      const response = await mutateAsync(data as any);
      setToken(response.token);
      setToast(response);
      navigate("/email/inbox");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) setToast(error?.response?.data);
    } finally {
      reset();
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
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
        <Button
          type="submit"
          className="btn btn-primary btn-active btn-block my-3 text-slate-100"
          disabled={isSubmitting || isPending}
        >
          Login
        </Button>
      </form>
    </>
  );
}
