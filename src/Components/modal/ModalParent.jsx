import { useState } from "react"
import Modal from "./Modal"

const ModalParent = () => {
    const [openModal, setOpenModal] = useState(false);

    const style = {
        // backgroundColor: "red",
    }

    return (
        <>
            <button onClick={() => setOpenModal(true)}>open</button>
            {openModal && <Modal
                open={openModal}
                onClose={() => setOpenModal(false)}
                title={"New Modal Box"}
                description={"Modal Description"}
                animation="slide"
                style={style}
            >
                <div>
                    <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. A voluptates eos tempora eaque perferendis fuga quas! Beatae dolore sequi architecto!</p>
                </div>
            </Modal>}
        </>
    )
}

export default ModalParent