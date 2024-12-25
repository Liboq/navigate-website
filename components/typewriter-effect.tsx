"use client"

import React, { useState, useEffect } from 'react'

interface TypewriterEffectProps {
  text: string
  speed?: number
}

const TypewriterEffect: React.FC<TypewriterEffectProps> = ({ text, speed = 100 }) => {
  const [displayText, setDisplayText] = useState('')

  useEffect(() => {
    let i = 0
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayText((prev) => prev + text.charAt(i))
        i++
      } else {
        clearInterval(timer)
      }
    }, speed)

    return () => clearInterval(timer)
  }, [text, speed])

  return (
    <p className="text-lg text-gray-700 typewriter-text">
      {displayText}
      <span className="cursor">|</span>
    </p>
  )
}

export default TypewriterEffect

