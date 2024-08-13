"use client";
import { useState, useEffect, FC, FormEvent } from "react";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { generateRandomAvatar } from "@/lib/helpers/generate-avatar";
import Spinner from "../../components/spinner";
import { registerSchema } from "@/lib/validators/form-validation";
import { createUser } from "@/lib/user";

const RegisterPage: FC = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const router = useRouter();

  const handleRefreshAvatar = () => {
    setAvatarUrl(generateRandomAvatar());
  };

  useEffect(() => {
    setAvatarUrl(generateRandomAvatar());
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = registerSchema.validate(
        { name, email, password, confirmPassword },
        { abortEarly: false }
      );
      if (error) {
        const errorObj: Record<string, string> = {};
        error.details.forEach((detail) => {
          errorObj[detail.path[0]] = detail.message;
        });
        setErrors(errorObj);
      } else {
        await createUser(email, password, name, avatarUrl);

        router.push("/");
        setErrors({});
      }
    } catch (error) {
      toast.error(error.message);
      setErrors({});
    }
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center h-screen font-primary p-10 m-2">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 w-full max-w-2xl shadow-lg p-10"
      >
        <h1 className="font-secondary text-xl text-center font-semibold text-[#0b3a65ff]">
          CHAT<span className="font-bold text-[#eeab63ff]">2</span>CHAT
        </h1>

        <div className="flex items-center space-y-2 justify-between border border-gray-200 p-2">
          <img
            src={avatarUrl}
            alt="Avatar"
            className=" rounded-full h-20 w-20"
          />
          <button
            type="button"
            className="btn btn-outline"
            onClick={handleRefreshAvatar}
          >
            New Avatar
          </button>
        </div>

        <div>
          <label className="label">
            <span className="text-base label-text">Name</span>
          </label>
          <input
            type="text"
            placeholder="Name"
            className="w-full input input-bordered"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && <span className="text-red-500">{errors.name}</span>}
        </div>

        <div>
          <label className="label">
            <span className="text-base label-text">Email</span>
          </label>
          <input
            type="text"
            placeholder="Email"
            className="w-full input input-bordered"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <span className="text-red-500">{errors.email}</span>}
        </div>

        <div>
          <label className="label">
            <span className="text-base label-text">Password</span>
          </label>
          <input
            type="password"
            placeholder="Enter Password"
            className="w-full input input-bordered"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && (
            <span className="text-red-500">{errors.password}</span>
          )}
        </div>

        <div>
          <label className="label">
            <span className="text-base label-text">Confirm Password</span>
          </label>
          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full input input-bordered"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {errors.confirmPassword && (
            <span className="text-red-500">{errors.confirmPassword}</span>
          )}
        </div>

        <div>
          <button
            type="submit"
            className="btn btn-block bg-[#0b3a65ff] text-white"
          >
            {loading ? <Spinner /> : "Sign Up"}
          </button>
        </div>

        <span>
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-blue-600 hover:text-blue-800 hover:underline"
          >
            Login
          </Link>
        </span>
      </form>
    </div>
  );
};

export default RegisterPage;
