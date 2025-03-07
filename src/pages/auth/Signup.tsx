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
import { Link } from "react-router"

export function Signup() {
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
              <form>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" type="text" placeholder="John Doe" required />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" type="text" placeholder="johndoe" required />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="m@example.com" required />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" placeholder="••••••••••" required />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="confirmPassword">Retype Password</Label>
                    <Input id="confirmPassword" type="password" placeholder="••••••••••" required />
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

                <div className="mt-4 text-center text-sm">
                  Already have account?{" "}
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
