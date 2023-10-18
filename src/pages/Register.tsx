import { Link } from "react-router-dom";
import { z } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import ky from "ky";

const signupSchema = z
  .object({
    firstname: z.string().min(1, "First name is required"),
    lastname: z.string().min(1, "Last name is required"),
    email: z
      .string()
      .min(1, "Email is required")
      .email({ message: "Invalid email" }),
    password: z.string().min(1, "Password is required"),
    passwordConfirmation: z
      .string()
      .min(1, "Password confirmation is required"),
  })
  .required()
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  });

type signupType = z.infer<typeof signupSchema>;

export default function SignUp() {
  const { isLoading, mutateAsync } = useMutation({
    mutationKey: ["register"],
    mutationFn: async (data: signupType) => {
      await ky.post("/api/auth/register", { json: { data } }).json();
    },
    onSuccess: () => {
      toast.success(
        "Votre inscription a bien été enregistrée, vous allez recevoir un mail de verification"
      );
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const onSubmit: SubmitHandler<signupType> = async (data) => {
    await mutateAsync(data);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<signupType>({
    resolver: zodResolver(signupSchema),
  });

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Firstname"
          id="firstname"
          className="bg-slate-100 p-3 rounded-lg"
          {...register("firstname")}
        />
        <p>{errors.firstname?.message}</p>
        <input
          type="text"
          placeholder="Lastname"
          id="lastname"
          className="bg-slate-100 p-3 rounded-lg"
          {...register("lastname")}
        />
        <p>{errors.lastname?.message}</p>
        <input
          type="email"
          placeholder="Email"
          id="email"
          className="bg-slate-100 p-3 rounded-lg"
          {...register("email")}
        />
        <p>{errors.email?.message}</p>
        <input
          type="password"
          placeholder="Password"
          id="password"
          className="bg-slate-100 p-3 rounded-lg"
          {...register("password")}
        />
        <p>{errors.password?.message}</p>

        <input
          type="password"
          placeholder="Password Confirmation"
          id="passwordConfirmation"
          className="bg-slate-100 p-3 rounded-lg"
          {...register("passwordConfirmation")}
        />
        <p>{errors.passwordConfirmation?.message}</p>
        <button
          disabled={isLoading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {isLoading ? "Loading..." : "Sign Up"}
        </button>
      </form>
      <div className="flex gap-2 mt-5">
        <p>Have an account?</p>
        <Link to="/login">
          <span className="text-blue-500">Sign in</span>
        </Link>
      </div>
    </div>
  );
}
