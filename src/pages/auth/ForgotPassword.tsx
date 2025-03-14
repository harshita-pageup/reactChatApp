
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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"

export function ForgotPassword() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">

        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Forgot Password</CardTitle>
              <CardDescription>
                Enter your email below to reset your password
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form>

                <div className="flex flex-col gap-6">

                  {/* Only show when the OTP is not verified */}
                  <div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="m@example.com" required />
                    </div>

                    {/* Show input when OTP sent */}
                    <div className="grid gap-2 hidden">
                      <Label htmlFor="otp">Enter OTP</Label>
                      <InputOTP maxLength={6}>
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                        </InputOTPGroup>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                  </div>

                  {/* Show when the OTP is verified */}
                  <div className="grid gap-2 hidden">
                    <div className="grid gap-2">
                      <Label htmlFor="password">Password</Label>
                      <Input id="password" type="password" placeholder="••••••••••" required />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="confirmPassword">Retype Password</Label>
                      <Input id="confirmPassword" type="password" placeholder="••••••••••" required />
                    </div>
                  </div>

                  <Button type="submit" className="w-full">
                    Send OTP
                  </Button>
                </div>

              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
