import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="w-full border-t border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-black/70 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Image src="/badge-demo.svg" alt="Trusted badge" width={36} height={36} />
          <div className="text-sm">
            <div className="font-medium">Trusted deals</div>
            <div className="text-xs text-gray-500">Curated by Coupons team</div>
          </div>
        </div>

        <div className="text-sm text-gray-600">© {new Date().getFullYear()} Coupons. All rights reserved.</div>

        <div className="flex gap-3">
          <a className="text-sm text-gray-700 hover:underline" href="#">Privacy</a>
          <a className="text-sm text-gray-700 hover:underline" href="#">Terms</a>
          <a className="text-sm text-gray-700 hover:underline" href="#">Contact</a>
        </div>
      </div>
    </footer>
  )
}
