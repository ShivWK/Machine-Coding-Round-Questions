import useToast from "../../hooks/useToast"

const Toast = () => {
  const { ToastContainer, triggerToast } = useToast("bottom-right")

  const clickHandler = (type, animation, message) => {
    const toast = {
      message,
      type,
      duration: 5000,
      animation
    }
    triggerToast(toast)
  }

  return (
    <div>
      <button onClick={() => clickHandler("success", "slide", "Hi the first Toast")}>Success Click</button>
      <button onClick={() => clickHandler("error", "pop", "Waring de raha hun")}>Error Click</button>
      {ToastContainer}
    </div>
  )
}

export default Toast;