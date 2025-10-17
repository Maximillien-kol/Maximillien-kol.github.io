import type React from "react"
import type { Metadata } from "next"
import { Poppins, Space_Grotesk } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"

const poppins = Poppins({
  weight: ["400", "800"],
  subsets: ["latin"],
  variable: "--font-poppins",
})

const spaceGrotesk = Space_Grotesk({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-space-grotesk",
})

export const metadata: Metadata = {
  title: "PillarQ - Simplify Your Customer Lines",
  description: "Be the first to experience the future",
  generator: "Maximillien",
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${poppins.variable} ${spaceGrotesk.variable}`}>
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
