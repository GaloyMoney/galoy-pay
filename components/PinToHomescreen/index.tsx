import React from "react"
import { Image } from "react-bootstrap"

import { getOS } from "../../lib/download"
import { ACTION_TYPE } from "../../pages/merchant/_reducer"
import Modal from "../CustomModal/modal"
import styles from "./pinToHomescreen.module.css"

interface Props {
  pinnedToHomeScreen: boolean
  dispatch: React.Dispatch<ACTION_TYPE>
}

const browser = (function () {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  const test = function (regexp) {
    if (typeof window !== "undefined") {
      return regexp.test(window.navigator.userAgent)
    }
  }
  switch (true) {
    case test(/edg/i):
      return "Microsoft Edge"
    case test(/trident/i):
      return "Microsoft Internet Explorer"
    case test(/firefox|fxios/i):
      return "Mozilla Firefox"
    case test(/opr\//i):
      return "Opera"
    case test(/ucbrowser/i):
      return "UC Browser"
    case test(/samsungbrowser/i):
      return "Samsung Browser"
    case test(/chrome|chromium|crios/i):
      return "Google Chrome"
    case test(/safari/i):
      return "Apple Safari"
    default:
      return "Other"
  }
})()
console.log(browser)

const iosModalContent = [
  {
    index: 1,
    text: "At the bottom of the screen or at the top right, click the “Share” icon.",
    image: "/tab-bar.png",
  },
  {
    index: 2,
    text: "The share sheet will show. Scroll down or swipe right to reveal the “Add to Homescreen” button. Click on it.",
    image: "/share-scroll.png",
  },
  {
    index: 3,
    text: "You can change the name of the page if you would like.",
    image: "/rename-register.png",
  },
  {
    index: 4,
    text: "Click “Add”. An icon will be added to your Home Screen so you can quickly access the page.",
    image: "/safari-explanation.png",
  },
]

const PinToHomscreen = ({ pinnedToHomeScreen, dispatch }: Props) => {
  const os = getOS()
  const pinToHomeRef = React.useRef(null)
  if (!pinnedToHomeScreen) return null
  let modalWidth: string

  if (os === "ios") {
    modalWidth = "340px"
    return (
      <>
        <Modal
          ref={pinToHomeRef}
          isOpened={pinnedToHomeScreen}
          dispatch={dispatch}
          modalWidth={modalWidth}
          modalTitle="How to pin the Cash Register to your home screen"
        >
          <div className={styles.wrapper}>
            {iosModalContent.map((content, idx) => {
              return (
                <div key={idx}>
                  <li className={styles.index}>{content.index}</li>
                  <p className={styles.text}>{content.text}</p>
                  <picture>
                    <Image
                      src={content.image}
                      alt={content.text}
                      width="100%"
                      height="100%"
                    />
                  </picture>
                </div>
              )
            })}
          </div>
        </Modal>
      </>
    )
  }

  if (os === "android") {
    return (
      <>
        <Modal
          ref={pinToHomeRef}
          isOpened={pinnedToHomeScreen}
          dispatch={dispatch}
          modalTitle="Add to home screen"
        >
          <div>android</div>
        </Modal>
      </>
    )
  }

  return (
    <>
      <Modal
        ref={pinToHomeRef}
        isOpened={pinnedToHomeScreen}
        dispatch={dispatch}
        modalTitle="How to pin the Cash Register to your home screen"
      >
        <div>desktop</div>
      </Modal>
    </>
  )
}

export default PinToHomscreen
