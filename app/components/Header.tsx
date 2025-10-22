import Image from 'next/image'
import Link from 'next/link'

export default function Header() {
  return (
    <header className="w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-black/70 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Image src="/logo-demo.svg" alt="Coupons logo" width={40} height={40} />
          <div>
            <h1 className="text-lg font-semibold">Coupons</h1>
            <p className="text-xs text-gray-500">Find the best deals & promo codes</p>
          </div>
        </div>

        <nav className="flex items-center gap-4">
          <Link className="text-sm text-gray-700 hover:underline" href="/">Home</Link>
          <Link className="text-sm text-gray-700 hover:underline" href="/stores">Stores</Link>
          <Link className="text-sm text-gray-700 hover:underline" href="/categories">Categories</Link>
          <Link className="text-sm text-gray-700 hover:underline" href="/about">About</Link>
        </nav>
      </div>
    </header>
  )
}
