'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface SearchBoxProps {
  defaultValue?: string
  placeholder?: string
  className?: string
}

export default function SearchBox({
  defaultValue = '',
  placeholder = 'Search tools, categories, use cases…',
  className = '',
}: SearchBoxProps) {
  const [query, setQuery] = useState(defaultValue)
  const router = useRouter()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={className}
      role="search"
      style={{ display: 'flex', gap: 8, maxWidth: 560, margin: '0 auto' }}
    >
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        aria-label="Search tools and categories"
        className="input"
        style={{ flex: 1 }}
      />
      <button type="submit" className="btn btn--primary">Search</button>
    </form>
  )
}
