import { useState } from "react"
import Modal from "./Modal"

const ModalParent = () => {
    const [openModal, setOpenModal] = useState(false);

    return (
        <>
            <button onClick={() => setOpenModal(true)}>open</button>
            {openModal && <Modal
                open={openModal}
                onClose={() => setOpenModal(false)}
                title={"New Modal Box"}
            >
                <div>
                    <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. A voluptates eos tempora eaque perferendis fuga quas! Beatae dolore sequi architecto!</p>
                </div>
            </Modal>}
        </>
    )
}

export default ModalParent