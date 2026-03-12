import useToast from "../../hooks/useToast"

const Toast = () => {
  const { ToastContainer, triggerToast } = useToast("bottom-right")

  const clickHandler = (type, animation) => {
    const toast = {
      message:"Hi the first Toast",
      type,
      duration: 5000,
      animation
    }
    triggerToast(toast)
  }

  return (
    <div>
      <button onClick={() => clickHandler("success")}>Success Click</button>
      <button onClick={() => clickHandler("error", "pop")}>Error Click</button>
      {ToastContainer}
    </div>
  )
}

export default Toast;