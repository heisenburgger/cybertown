import React from 'react'

type Props = {
  children: React.ReactNode
  classes: string
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export function Button(props: Props) {
  const { children, classes, ...restProps } = props
  return (
    <button {...restProps} className={classes}>
      {children}
    </button>
  )
}
