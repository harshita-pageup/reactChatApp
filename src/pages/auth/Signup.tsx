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
import { SignupRequest } from "@/types/auth"

export function Signup() {
  const [formData, setFormData] = useState<SignupRequest>({
    name: "",
    email: "",
    contact: "",
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name) newErrors.name = "Name is required"
    if (!formData.email) newErrors.email = "Email is required"
    if (!formData.contact) newErrors.contact = "Contact is required"
    if (!formData.password) newErrors.password = "Password is required"
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    const apiUrl = import.meta.env.VITE_API_URL;
    const response = await fetch(`${apiUrl}/api/registerUser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })

    const data = await response.json()

    if (response.ok) {
      navigate("/")
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        apiError: data.message || "An error occurred, please try again.",
      }))
    }
  }

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
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" type="text" placeholder="John Doe" value={formData.name} onChange={handleChange} />
                    {errors.name && <p className="text-red-500">{errors.name}</p>}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="m@example.com" value={formData.email} onChange={handleChange} />
                    {errors.email && <p className="text-red-500">{errors.email}</p>}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="contact">Contact</Label>
                    <Input id="contact" type="tel" placeholder="8989898989" value={formData.contact} onChange={handleChange} />
                    {errors.contact && <p className="text-red-500">{errors.contact}</p>}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" placeholder="••••••••••" value={formData.password} onChange={handleChange} />
                    {errors.password && (
                      <p className="text-red-500">{errors.password}</p>
                    )}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="confirmPassword">Retype Password</Label>
                    <Input id="confirmPassword" type="password" placeholder="••••••••••" value={formData.confirmPassword} onChange={handleChange} />
                    {errors.confirmPassword && (
                      <p className="text-red-500">{errors.confirmPassword}</p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 col-span-2 place-items-center">
                    <Button type="submit" className="w-sm">
                      Create Account
                    </Button>
                    <Button variant="outline" className="w-sm">
                      Signup with Google
                    </Button>
                  </div>
                </div>

                {errors.apiError && (
                  <div className="mt-4 text-center text-red-500">
                    {errors.apiError}
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