import { useModalStore } from "../../../hooks/use-modal"
import { Modal } from "../modal";

export const StoreModal = () => {
    const modal = useModalStore();

    return (
        <Modal isOpen={modal.isOpen} title="Modal" description="Holla new modal" onClose={modal.onClose} >
            <div>Modal Content</div>
        </Modal>
    )
}