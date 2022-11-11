import React, { type FC, useState } from "react"

import ShareController from "./share-controller"
import SharePopup from "./share-pop-up"

interface Props {
  children: React.ReactNode
  shareData: ShareData
  onSuccess?: () => void
  onError?: (error?: unknown) => void
  onInteraction?: () => void
  files: [string]
  image: string
  getImage?: () => void
  shareState: string | undefined
  disabled?: boolean
}

const Share: FC<Props> = ({
  children,
  shareData,
  onInteraction,
  files,
  image,
  getImage,
  shareState,
  onSuccess,
  onError,
  disabled,
}) => {
  const [openPopup, setOpenPopup] = useState(false)

  const handleNonNativeShare = () => {
    setOpenPopup(true)
  }

  return (
    <>
      <ShareController
        shareData={shareData}
        files={files}
        getImage={getImage}
        onInteraction={onInteraction}
        onSuccess={onSuccess}
        onError={onError}
        onNonNativeShare={handleNonNativeShare}
        disabled={disabled}
      >
        {children}
      </ShareController>

      {openPopup ? (
        <SharePopup
          shareData={shareData}
          getImage={getImage}
          image={image}
          shareState={shareState}
          onClose={() => setOpenPopup(false)}
        />
      ) : null}
    </>
  )
}

export default Share
