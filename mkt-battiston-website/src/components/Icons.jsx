const strokeProps = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export function ClockIcon({ className, ...props }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...strokeProps} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  )
}

export function CoinIcon({ className, ...props }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...strokeProps} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M14.8 9.2a3.2 3.2 0 0 0-2.8-1.4c-1.8 0-3 1-3 2.2 0 3 6 1.6 6 4.4 0 1.2-1.2 2.2-3 2.2a3.4 3.4 0 0 1-3-1.5" />
      <path d="M12 6v2M12 16v2" />
    </svg>
  )
}

export function InfinityIcon({ className, ...props }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...strokeProps} {...props}>
      <path d="M18.2 8.5a3.5 3.5 0 1 1 0 7C15 15.5 9 8.5 5.8 8.5a3.5 3.5 0 1 0 0 7C9 15.5 15 8.5 18.2 8.5Z" />
    </svg>
  )
}

export function TrophyIcon({ className, ...props }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...strokeProps} {...props}>
      <path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4Z" />
      <path d="M7 6H4a1 1 0 0 0-1 1c0 2.2 1.5 4 4 4M17 6h3a1 1 0 0 1 1 1c0 2.2-1.5 4-4 4" />
    </svg>
  )
}

export function WhatsAppIcon({ className, ...props }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" {...props}>
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.6.8-.8 1-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4 0-.5.1-.7l.4-.5c.1-.2.1-.3 0-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2c0 1.3 1 2.6 1.1 2.8.1.2 1.9 3 4.7 4.2.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2 0-.1-.2-.2-.4-.3Z" />
    </svg>
  )
}

export function InstagramIcon({ className, ...props }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...strokeProps} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

export function FacebookIcon({ className, ...props }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" {...props}>
      <path d="M13.5 21v-7h2.4l.4-3h-2.8V9.1c0-.9.3-1.5 1.6-1.5h1.4V4.9c-.3 0-1.1-.1-2-.1-2 0-3.4 1.2-3.4 3.5V11H8.5v3h2.6v7h2.4Z" />
    </svg>
  )
}

export function TikTokIcon({ className, ...props }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" {...props}>
      <path d="M16.6 3c.4 2 1.7 3.3 3.9 3.5v2.8c-1.5 0-2.8-.4-3.9-1.2v5.9a5.6 5.6 0 1 1-5.6-5.6c.3 0 .7 0 1 .1v2.9a2.7 2.7 0 1 0 1.8 2.6V3h2.8Z" />
    </svg>
  )
}

export function YouTubeIcon({ className, ...props }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" {...props}>
      <path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26.4 26.4 0 0 0 2 12c0 1.6.1 3.2.4 4.8a2.5 2.5 0 0 0 1.8 1.8c1.6.4 7.8.4 7.8.4s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8c.3-1.6.4-3.2.4-4.8s-.1-3.2-.4-4.8ZM10 15.2V8.8l5.2 3.2L10 15.2Z" />
    </svg>
  )
}

export function ChevronIcon({ className, ...props }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...strokeProps} {...props}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

export function CheckIcon({ className, ...props }) {
  return (
    <svg viewBox="0 0 24 24" className={className} {...strokeProps} strokeWidth={2.4} {...props}>
      <path d="m5 13 4 4L19 7" />
    </svg>
  )
}

export const PLATFORM_ICONS = {
  youtube: YouTubeIcon,
  tikpro: TikTokIcon,
  whatsapp: WhatsAppIcon,
  facebook: FacebookIcon,
  instagram: InstagramIcon,
}
