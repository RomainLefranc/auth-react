import { Link, useNavigate } from "react-router-dom";
import { useAccountStore } from "../store/store";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ky from "ky";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { UserAccount } from "../types/types";

const loginInputSchema = z
  .object({
    email: z.string().min(1, "Email is required").email("Invalid email"),
    password: z.string().min(1, "Password is required"),
  })
  .required();

type LoginInputType = z.infer<typeof loginInputSchema>;

export default function Login() {
  const { setAccount } = useAccountStore();
  const navigate = useNavigate();
  const { isLoading, mutateAsync } = useMutation({
    mutationKey: ["login"],
    mutationFn: async (data: LoginInputType): Promise<UserAccount> =>
      await ky.post("/api/auth/login", { json: { data } }).json(),
    onSuccess: (data: UserAccount) => {
      toast.success("Connexion réussie");
      setAccount(data);
      navigate("/");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const onSubmit: SubmitHandler<LoginInputType> = async (data) => {
    mutateAsync(data);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInputType>({
    resolver: zodResolver(loginInputSchema),
  });

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          {...register("email")}
          className="bg-slate-100 p-3 rounded-lg"
        />
        <p>{errors.email?.message}</p>
        <input
          type="password"
          placeholder="Password"
          className="bg-slate-100 p-3 rounded-lg"
          {...register("password")}
        />
        <p>{errors.password?.message}</p>
        <button
          disabled={isLoading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {isLoading ? "Loading..." : "Sign In"}
        </button>
      </form>
      <div className="flex gap-2 mt-5">
        <p>Dont Have an account?</p>
        <Link to="/register">
          <span className="text-blue-500">Sign up</span>
        </Link>
      </div>
    </div>
  );
}
