"use client"

import Header from "./header"
import Icon from "./icon"

const SearchHeader: React.FC<{
  placeholder: string
  value: string
  onChange: (value: string) => void
  onEnter: (event: React.KeyboardEvent) => void
}> = ({ placeholder, value, onChange, onEnter }) => {
  const keyboardEvents: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    e.preventDefault()
    if (onEnter && e.keyCode === 13) onEnter(e)
  }

  return (
    <Header>
      <div className="flex justify-center flex-1 lg:mr-32">
        <div className="border rounded relative w-full max-w-xl p-2 focus-within:text-blue-500">
          <div className="absolute inset-y-0 flex items-center pl-2">
            <Icon className="w-4 h-4" aria-hidden="true" icon="SearchIcon" />
          </div>
          <input
            id="search"
            autoFocus
            type="text"
            placeholder={placeholder}
            aria-label="Search"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyUp={keyboardEvents}
            className="block w-full text-sm focus:outline-none form-input leading-5 focus:border-blue-400 focus:shadow-outline-blue pl-8 text-gray-700"
          />
        </div>
      </div>
    </Header>
  )
}

export default SearchHeader
