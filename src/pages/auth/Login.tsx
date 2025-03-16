import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { setToken } from "@/utils/auth";
import * as Yup from "yup";
import { useFormik } from "formik";
import { LoginRequest } from "@/types/auth";
import ValidationMsg from "@/components/validation-err";
import AlertMsg from "@/components/alert-msg";
import { Loader2 } from "lucide-react";
import axiosInstance from "@/api/axiosInstance";
import { useUser } from "@/context/UserContext";

export function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user,setUser } = useUser();

  const validationSchema = Yup.object({
    username: Yup.string().email("Invalid email format").required("Username is required"),
    password: Yup.string().required("Password is required"),
  });

  const formik = useFormik<LoginRequest>({
    initialValues: { username: "", password: "" },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setError("");

      try {
        const response = await axiosInstance.post(`/api/standardLogin`, values);
        if (response.data.status && response.data.data.token) {
          setToken(response.data.data.token);
          const userData = {
            id: response.data.data.user_info.id,
            name: response.data.data.user_info.name,
            email: response.data.data.user_info.email,
            profile: "https://ui-avatars.com/api/"+response.data.data.user_info.name
          }
          setUser(userData);
          localStorage.setItem("user", JSON.stringify(userData));
          navigate("/chats");
        } else {
          setError(response.data.msg);
        }
      } catch (err: any) {
        setError(err?.message || "An unknown error occurred.");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        {error && (
          <AlertMsg msg={error} />
        )}
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Login</CardTitle>
              <CardDescription>
                Enter your email below to login to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={formik.handleSubmit}>
                <div className="flex flex-col gap-6">

                  <div className="grid gap-2">
                    <Label htmlFor="username">Email</Label>
                    <div>
                      <Input id="username" type="email" placeholder="m@example.com" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.username} />
                      {formik.errors.username && formik.touched.username && (
                        <ValidationMsg msg={formik.errors.username} />
                      )}
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                      <Link to="/forgot-password" className="ml-auto inline-block text-sm underline-offset-4 hover:underline" >
                        Forgot your password?
                      </Link>
                    </div>
                    <div>
                      <Input id="password" type="password" placeholder="••••••••••" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.password} />
                      {formik.errors.password && formik.touched.password && (
                        <ValidationMsg msg={formik.errors.password} />
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading && (<Loader2 className="animate-spin" />)}
                      Login
                    </Button>

                    <Button variant="outline" className="w-full">
                      Login with Google
                    </Button>
                  </div>
                </div>

                <div className="mt-4 text-center text-sm">
                  Don't have an account?{" "}
                  <Link to="/signup" className="underline underline-offset-4">
                    Sign up
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}