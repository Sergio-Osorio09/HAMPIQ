import { useState } from 'react'
import type { CSSProperties, ElementType, ComponentPropsWithoutRef } from 'react'
import { s } from '@/lib/style'

type BoxOwnProps = {
  /** Base style, as a CSS string (ported from the prototype) or object. */
  css?: string | CSSProperties
  /** Style applied while hovered (replaces the prototype's `style-hover`). */
  hover?: string | CSSProperties
  /** Style applied while focused (replaces the prototype's `style-focus`). */
  focus?: string | CSSProperties
}

type BoxProps<T extends ElementType> = BoxOwnProps & { as?: T } & Omit<
  ComponentPropsWithoutRef<T>,
  keyof BoxOwnProps | 'as' | 'style'
>

const toObj = (v?: string | CSSProperties): CSSProperties =>
  v == null ? {} : typeof v === 'string' ? s(v) : v

/**
 * Polymorphic styled element that supports hover/focus styles the way the
 * Hampiq prototype's runtime did. Defaults to a <div>; pass `as` for buttons,
 * inputs, spans, etc.
 */
export function Box<T extends ElementType = 'div'>({
  as,
  css,
  hover,
  focus,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  ...rest
}: BoxProps<T>) {
  const Tag = (as || 'div') as ElementType
  const [isHover, setHover] = useState(false)
  const [isFocus, setFocus] = useState(false)

  const style: CSSProperties = {
    ...toObj(css),
    ...(isHover ? toObj(hover) : {}),
    ...(isFocus ? toObj(focus) : {}),
  }

  return (
    <Tag
      style={style}
      onMouseEnter={(e: never) => {
        if (hover) setHover(true)
        ;(onMouseEnter as ((e: never) => void) | undefined)?.(e)
      }}
      onMouseLeave={(e: never) => {
        if (hover) setHover(false)
        ;(onMouseLeave as ((e: never) => void) | undefined)?.(e)
      }}
      onFocus={(e: never) => {
        if (focus) setFocus(true)
        ;(onFocus as ((e: never) => void) | undefined)?.(e)
      }}
      onBlur={(e: never) => {
        if (focus) setFocus(false)
        ;(onBlur as ((e: never) => void) | undefined)?.(e)
      }}
      {...rest}
    />
  )
}
