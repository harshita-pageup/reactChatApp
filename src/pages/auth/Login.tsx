import { useEffect, useState } from "react";
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
import { Link, useNavigate } from "react-router";
import { isAuthenticated, setToken } from "@/utils/auth";
import { LoginRequest } from "@/types/auth";

export function Login() {
  const [formData, setFormData] = useState<LoginRequest>({
      username: "",
      password: ""
    })

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({})
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/dashboard"); // Adjust the path to where you want to redirect
    }
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.username) newErrors.username = "Username is required"
    if (!formData.password) newErrors.password = "Password is required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const apiUrl = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${apiUrl}/api/standardLogin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Login failed. Please check your credentials.");
      }

      const json_data = await response.json();

      setToken(json_data.data.token);
      navigate("/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message); 
      } else {
        setError("An unknown error occurred."); // Handle non-Error cases
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Login</CardTitle>
              <CardDescription>
                Enter your email below to login to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="username">Email</Label>
                    <Input id="username" type="email" placeholder="m@example.com" required value={formData.username} onChange={handleChange} />
                    {errors.username && <p className="text-red-500">{errors.username}</p>}
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                      <a href="#" className="ml-auto inline-block text-sm underline-offset-4 hover:underline" >
                        Forgot your password?
                      </a>
                    </div>
                    <Input id="password" type="password" placeholder="••••••••••" required value={formData.password} onChange={handleChange} />
                    {errors.password && <p className="text-red-500">{errors.password}</p>}
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                  </Button>

                  <Button variant="outline" className="w-full">
                    Login with Google
                  </Button>
                </div>

                {error && (
                  <div className="mt-4 text-center text-red-500">
                    <p>{error}</p>
                  </div>
                )}

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