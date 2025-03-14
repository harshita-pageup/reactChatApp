type ValidationMsgProps = { msg: string }
const ValidationMsg = ({ msg }: ValidationMsgProps) => {
  return (
    <small className="text-red-500 text-xs">{msg}</small>
  )
}

export default ValidationMsg