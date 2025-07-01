import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Button,
} from "@/components/ui";
import { useForm } from "react-hook-form";
// import { useNavigate } from "react-router-dom"
import useAsync from "@/hooks/useAsync";
import authService from "../appwrite/auth";
import { login } from "@/features/authSlice";
import { LoadingSpinner } from "@/components";
import { toast } from "sonner";
import { useAppDispatch } from "@/hooks/useStore";
import { Link, useNavigate } from "react-router-dom";

type InputData = {
  name: string;
  email: string;
  password: string;
};

export default function Signup() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
  } = useForm<InputData>({
    mode: "onChange",
    delayError: 700,
  });

  const { loading, execute } = useAsync(async (formData: InputData) => {
    const session = await authService.createAccount(formData);
    if (session) {
      const userData = await authService.getCurrentUser();
      if (!userData) {
        throw new Error("User not found");
      }
      toast.success("Account created successfully");
      dispatch(login({ userData }));
      navigate(`/@${userData.name}`, { replace: true });
    }
  });

  const signup = async (formData: InputData) => {
    await execute(formData);
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="px-5">
        <CardTitle>Signup to create account</CardTitle>
        <CardDescription>
          Enter your details below to create an account
        </CardDescription>
      </CardHeader>
      <CardContent className="px-5">
        <form onSubmit={handleSubmit(signup)}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="name"
                placeholder="Your name"
                {...register("name", {
                  required: true,
                  minLength: {
                    value: 3,
                    message: "Minimum 3 characters required",
                  },
                })}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name?.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                {...register("email", {
                  required: true,
                  validate: {
                    matchPattern: (value: string) =>
                      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(
                        value
                      ) || "Email address must be a valid address",
                  },
                })}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email?.message}</p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Your password"
                {...register("password", {
                  required: true,
                  minLength: {
                    value: 6,
                    message: "Minimum 6 characters required",
                  },
                })}
              />
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password?.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              disabled={!isDirty || !isValid}
              className={`w-full text-white cursor-pointer ${
                !isValid ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Create account
              {loading ? <LoadingSpinner /> : ""}
            </Button>
          </div>
        </form>
        <CardFooter className="flex-col">
          <div className="flex items-center">
            <CardDescription>Already have an account?</CardDescription>
            <CardAction>
              <Link to={"/login"}>
                <Button variant="link">Log in</Button>
              </Link>
            </CardAction>
          </div>
        </CardFooter>
      </CardContent>
    </Card>
  );
}
