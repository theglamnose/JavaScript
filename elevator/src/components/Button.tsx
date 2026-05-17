import "./Button.css"

type ButtonProps = {
    floor: number,
    pushed: boolean
}

export default function Button( {floor,pushed}: ButtonProps) {
  return (
    <p  className = { "cabinButton " + (pushed ? "on" : "off")}> {floor} </p>
  )
}
