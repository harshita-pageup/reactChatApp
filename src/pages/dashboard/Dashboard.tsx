import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function Dashboard() {
    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
            <div className="w-full max-w-sm">
                <div className="flex flex-col gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl text-center">Chat</CardTitle>
                        </CardHeader>
                        <CardContent>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}