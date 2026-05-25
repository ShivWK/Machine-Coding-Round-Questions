// import Toast from "./components/toast/Toast";
// import PaginationFirstParent from "./components/pagination/PaginationFirstParent";
// import PaginationSecondParent from "./components/pagination/PaginationSecondParent";
// import InfiniteScrollParent from "./components/infinite_scroll/InfiniteScrollParent"
// import ModalParent from "./components/modal/ModalParent"
// import AutoCompleteParent from "./components/autocomplete/AutoCompleteParent"
// import AccordionParent from "./components/accordion/accordionParent"
// import Otp from "./components/otp/OtpComponent"
// import Timer from "./components/timer/Timer";
import StarRating from "./components/star_rating/StarRating";

function App() {
  return (
    // <Toast type="success" message={"New notification"} /> 
    // <PaginationFirstParent />
    // <PaginationSecondParent />
    // <InfiniteScrollParent />
    // <ModalParent />
    // <AutoCompleteParent />
    // <AccordionParent />
    // <Otp count={4} onComplete={(otp) => {console.log(otp)}} />
    // <Timer />
    <StarRating value={0} onChange={(value) => {console.log(value)}} count={5} />
  )
}

export default App
