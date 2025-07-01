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
import useAsync from "@/hooks/useAsync";
import { useForm } from "react-hook-form";
import { LoadingSpinner } from "@/components";
import authService from "../appwrite/auth";
import { toast } from "sonner";
import { login as authLogin } from "@/features/authSlice";
import { useAppDispatch } from "@/hooks/useStore";
import { Link, useNavigate } from "react-router-dom";

type InputData = {
  email: string;
  password: string;
};

export default function Login() {
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
    const session = await authService.login(formData);
    if (session) {
      const userData = await authService.getCurrentUser();
      if (!userData) {
        throw new Error("User not found");
      }
      toast.success("Login success");
      dispatch(authLogin({ userData }));
      navigate(`/@${userData.name}`, { replace: true });
    }
  });

  const login = async (formData: InputData) => {
    await execute(formData);
  };

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="px-5">
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent className="px-5">
        <form onSubmit={handleSubmit(login)}>
          <div className="flex flex-col gap-6">
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
                    value: 8,
                    message: "Minimum 8 characters required",
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
              Login {loading ? <LoadingSpinner /> : ""}
            </Button>
          </div>
        </form>
        <CardFooter className="flex-col">
          <div className="flex items-center">
            <CardDescription>Don't have an account yet?</CardDescription>
            <CardAction>
              <Link to={"/signup"}>
                <Button variant="link">Sign Up</Button>
              </Link>
            </CardAction>
          </div>
        </CardFooter>
      </CardContent>
    </Card>
  );
}
