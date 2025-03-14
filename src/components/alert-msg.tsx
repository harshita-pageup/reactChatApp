import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, XCircle } from "lucide-react"

type AlertMsgProps = { msg: string, isSuccess?: boolean }
const AlertMsg = ({ msg, isSuccess = false }: AlertMsgProps) => {
  return (
    <Alert variant="default" className="mb-2">
      {isSuccess ? (
        <>
          <CheckCircle className="h-4 w-4" />
          <AlertTitle>Success</AlertTitle>
        </>
      ) : (
        <>
          <XCircle className="h-4 w-4" />
          <AlertTitle>Failed</AlertTitle>
        </>
      )}
      <AlertDescription>{msg}</AlertDescription>
    </Alert>
  )
}

export default AlertMsg