import React from "react"
import Image from "react-bootstrap/Image"

import { ACTION_TYPE, ACTIONS } from "../../pages/merchant/_reducer"
import styles from "./modal.module.css"

interface Props {
  children?: React.ReactNode
  ref?: React.LegacyRef<HTMLDivElement>
  isOpened?: boolean
  modalTitle?: string
  modalWidth?: string
  dispatch: React.Dispatch<ACTION_TYPE>
}

const Modal = React.forwardRef(
  (
    { children, isOpened, modalTitle, modalWidth, dispatch }: Props,
    ref: React.ForwardedRef<HTMLDivElement>,
  ) => {
    const defaultModalWidth = modalWidth || "100%"
    const defaultRef = React.useRef(null)
    const modalFocus = ref || defaultRef.current

    const [isOpen, setIsOpen] = React.useState<boolean>(isOpened || true)

    const handleClose = () => {
      setIsOpen(false)
      dispatch({
        type: ACTIONS.PINNED_TO_HOMESCREEN,
        payload: false,
      })
    }

    return (
      <dialog open={isOpen} onClose={() => setIsOpen(false)} className={styles.modal}>
        <div className={styles.modal_wrapper} style={{ width: defaultModalWidth }}>
          <button onClick={handleClose} className={styles.close_btn}>
            <Image src="/icons/cross-icon.svg" />
          </button>
          <div ref={modalFocus}>
            <div className={styles.modal_title}>{modalTitle || ""}</div>
            <div className={styles.modal_con0tent}>{children}</div>
          </div>
        </div>
      </dialog>
    )
  },
)

export default Modal
