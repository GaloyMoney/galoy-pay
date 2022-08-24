import { ChangeEvent } from "react"

import { useMutation } from "@galoymoney/client"

import useMainQuery from "hooks/use-main-query"
import { setLocale, translate, useAppState } from "store/index"

import Icon from "components/icon"

const languageLabels = {
  "DEFAULT": "Default (OS)",
  "en-US": "English",
  "es-SV": "Spanish",
} as const

type FCT = React.FC<{ guestView: boolean }>

const LanguageSetting: FCT = ({ guestView }) => {
  const { language } = useMainQuery()
  const { defaultLanguage } = useAppState()

  const [updateLanguage, { loading }] = useMutation.userUpdateLanguage({
    onCompleted: (completed) => {
      setLocale(completed?.userUpdateLanguage.user?.language || defaultLanguage)
    },
  })

  const handleLanguageChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = event.currentTarget.value
    updateLanguage({ variables: { input: { language: newLanguage } } })
  }

  return (
    <div className="setting">
      <div className="icon">
        <Icon name="world" />
      </div>
      <div className="name">
        {translate("Language")}
        <div className="sub">{translate(languageLabels[language || "DEFAULT"])}</div>
      </div>
      <div className="action">
        <select
          name="language"
          value={language}
          onChange={handleLanguageChange}
          disabled={guestView || loading}
        >
          {Object.entries(languageLabels).map(([key, label]) => {
            return (
              <option key={key} value={key}>
                {translate(label)}
              </option>
            )
          })}
        </select>
      </div>
    </div>
  )
}

export default LanguageSetting
