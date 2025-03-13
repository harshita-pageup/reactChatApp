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

export function Signup() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string().max(150).email("Invalid email address").required("Email is required"),
    contact: Yup.string().required("Contact number is required"),
    password: Yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const formik = useFormik({
    initialValues: { name: "", email: "", contact: "", password: "", confirmPassword: "" },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setError("");

      const apiUrl = import.meta.env.VITE_API_URL;

      try {
        const response = await fetch(`${apiUrl}/api/registerUser`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        const json_data = await response.json();

        if (!response.ok) {
          throw new Error(json_data.msg);
        }

        setToken(json_data.data.token);
        navigate("/dashboard");
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred.");
        }
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-xl">
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
                    <Input id="name" type="text" placeholder="John Doe" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.name} />
                    {formik.errors.name && formik.touched.name && (
                      <p className="text-red-500">{formik.errors.name}</p>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="m@example.com" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.email} />
                    {formik.errors.email && formik.touched.email && (
                      <p className="text-red-500">{formik.errors.email}</p>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="contact">Contact</Label>
                    <Input id="contact" type="tel" placeholder="8989898989" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.contact} />
                    {formik.errors.contact && formik.touched.contact && (
                      <p className="text-red-500">{formik.errors.contact}</p>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" placeholder="••••••••••" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.password} />
                    {formik.errors.password && formik.touched.password && (
                      <p className="text-red-500">{formik.errors.password}</p>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="confirmPassword">Retype Password</Label>
                    <Input id="confirmPassword" type="password" placeholder="••••••••••" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.confirmPassword} />
                    {formik.errors.confirmPassword && formik.touched.confirmPassword && (
                      <p className="text-red-500">{formik.errors.confirmPassword}</p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 col-span-2 place-items-center">
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "Please wait..." : "Create Account"}
                    </Button>
                    <Button variant="outline" className="w-sm">
                      Signup with Google
                    </Button>
                  </div>
                </div>

                {error && (
                  <div className="mt-4 text-center text-red-500">
                    <p>{error}</p>
                  </div>
                )}

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