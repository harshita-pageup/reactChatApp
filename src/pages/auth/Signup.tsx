import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link, useNavigate } from "react-router-dom"
import * as Yup from "yup";
import { setToken } from "@/utils/auth"
import { useFormik } from "formik"
import { SignupRequest } from "@/types/auth"
import AlertMsg from "@/components/alert-msg"
import ValidationMsg from "@/components/validation-err"
import { Loader2 } from "lucide-react"
import axiosInstance from "@/api/axiosInstance"
import { useUser } from "@/context/UserContext"

export function Signup() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { setUser } = useUser();
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string().max(150).email("Invalid email address").required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .matches(/[a-z]/, "Password must contain at least one lowercase letter")
      .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
      .matches(/[0-9]/, "Password must contain at least one number")
      .matches(/[@$!%*?&]/, "Password must contain at least one special character")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const formik = useFormik<SignupRequest>({
    initialValues: { name: "", email: "", password: "", confirmPassword: "" },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setError("");

      try {
        console.log('Entered into Signup::onSubmit');
        const response = await axiosInstance.post(`/api/registerUser`, values);
        if (response.data.status && response.data.data.token) {
          setToken(response.data.data.token);
          setUser(response.data.data.user_info);
          navigate("/chats");
        } else {
          setError(response.data.msg);
        }
      } catch (error: any) {
        console.log('Error in Signup::onSubmit ->', error);
        setError(error?.message || "An unknown error occurred.");
      } finally {
        console.log('Exited from Signup::onSubmit');
        setLoading(false);
      }
    },
  });

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-xl">
        {error && (
          <AlertMsg msg={error} />
        )}
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Signup</CardTitle>
              <CardDescription>
                Enter your information below to create your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={formik.handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <div>
                      <Input id="name" type="text" placeholder="John Doe" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.name} />
                      {formik.errors.name && formik.touched.name && (
                        <ValidationMsg msg={formik.errors.name} />
                      )}
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <div>
                      <Input id="email" type="email" placeholder="m@example.com" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.email} />
                      {formik.errors.email && formik.touched.email && (
                        <ValidationMsg msg={formik.errors.email} />
                      )}
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <div>
                      <Input id="password" type="password" placeholder="••••••••••" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.password} />
                      {formik.errors.password && formik.touched.password && (
                        <ValidationMsg msg={formik.errors.password} />
                      )}
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="confirmPassword">Retype Password</Label>
                    <div>
                      <Input id="confirmPassword" type="password" placeholder="••••••••••" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.confirmPassword} />
                      {formik.errors.confirmPassword && formik.touched.confirmPassword && (
                        <ValidationMsg msg={formik.errors.confirmPassword} />
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 col-span-2 place-items-center">
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading && (<Loader2 className="animate-spin" />)}
                      Create Account
                    </Button>
                    <Button variant="outline" className="w-full">
                      Signup with Google
                    </Button>
                  </div>
                </div>

                <div className="mt-4 text-center text-sm">
                  Already have an account?{" "}
                  <Link to="/" className="underline underline-offset-4">
                    Login
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