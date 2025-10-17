import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowUpRight, Star } from "lucide-react"
import FeaturesSectionDemo from "@/components/ui/features-section-demo-3"
import HowItWorks from "@/components/ui/how-it-works"
import InfiniteMovingCardsDemo from "@/components/ui/infinite-moving-cards-demo"
import CtaFooterSection from "@/components/ui/cta-footer-section"
import Link from "next/link"

export default function wishlistPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#BFDBF7] via-[#F9F9F9] to-[#F9F9F9]">
      {/* Header with Join wishlist button only */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <Link href="/">
          <div className="text-2xl font-extrabold cursor-pointer" style={{ fontFamily: "var(--font-poppins)", color: "#022B3A" }}>
            PillarQ
          </div>
        </Link>
        <Link href="/waitlist">
          <Button
            size="lg"
            className="font-sans"
            style={{
              backgroundColor: "#022B3A",
              color: "#F9F9F9",
              fontFamily: "var(--font-space-grotesk)",
            }}
          >
            Join wishlist
          </Button>
        </Link>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-8">
          <p
            className="text-sm md:text-base tracking-[0.3em] mb-6 uppercase"
            style={{
              fontFamily: "var(--font-space-grotesk)",
              color: "#022B3A",
            }}
          >
            Simplify Your
          </p>
          <h1
            className="text-5xl md:text-7xl lg:text-8xl font-extrabold mb-6 text-balance leading-tight"
            style={{
              fontFamily: "var(--font-poppins)",
              color: "#022B3A",
            }}
          >
            Customers Lines
          </h1>
          <p
            className="text-base md:text-lg max-w-2xl mx-auto mb-8 leading-relaxed"
            style={{
              fontFamily: "var(--font-space-grotesk)",
              color: "#022B3A",
            }}
          >
            PillarQ offers reliable and flexible Queue system tailored to your business, startup, and enterprise  with everything it needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/waitlist">
              <Button
                size="lg"
                className="font-sans px-8"
                style={{
                  backgroundColor: "#022B3A",
                  color: "#F9F9F9",
                  fontFamily: "var(--font-space-grotesk)",
                }}
              >
                Join wishlist
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="lg"
              className="font-sans gap-2"
              style={{
                color: "#022B3A",
                fontFamily: "var(--font-space-grotesk)",
              }}
            >
              <span>▶</span>
              Explore PillarQ
            </Button>
          </div>
        </div>

        
        {/* Bottom Section with Testimonial and Feature Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-9 mt-5" style={{height: "auto"}}>
          {/* Testimonial Card */}
          <Card className="p-8 bg-[#BFDBF7]/30 border-none lg:col-span-1">
            <p
              className="text-sm leading-relaxed mb-6"
              style={{
                fontFamily: "var(--font-space-grotesk)",
                color: "#022B3A",
              }}
            >
              PillarQ simplified my business, it gave me peace of mind and real management I needed the most. Fast and
              great support!
            </p>
            <div
              className="text-2xl font-extrabold italic"
              style={{
                fontFamily: "var(--font-poppins)",
                color: "#022B3A",
              }}
            >
              — Sostene M.
            </div>
          </Card>

          {/* Life Insurance Card */}
          <Card className="p-6 bg-card border-none hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 stroke-yellow-400" />
                ))}
                <span
                  className="ml-2 text-sm"
                  style={{
                    fontFamily: "var(--font-space-grotesk)",
                    color: "#022B3A",
                  }}
                >
                  (868)
                </span>
              </div>
              <ArrowUpRight className="w-5 h-5" style={{ color: "#022B3A" }} />
            </div>
            <h3
              className="text-xl font-extrabold mb-3"
              style={{
                fontFamily: "var(--font-poppins)",
                color: "#022B3A",
              }}
            >
              Customer Management
            </h3>
            <p
              className="text-sm leading-relaxed"
              style={{
                fontFamily: "var(--font-space-grotesk)",
                color: "#022B3A",
              }}
            >
              Determine who serve your customer and allow customer to move faster without waiting others to finish.
            </p>
          </Card>

          {/* Health Insurance Card */}
          <Card className="p-6 bg-card border-none hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 stroke-yellow-400" />
                ))}
                <span
                  className="ml-2 text-sm"
                  style={{
                    fontFamily: "var(--font-space-grotesk)",
                    color: "#022B3A",
                  }}
                >
                  (692)
                </span>
              </div>
              <ArrowUpRight className="w-5 h-5" style={{ color: "#022B3A" }} />
            </div>
            <h3
              className="text-xl font-extrabold mb-3"
              style={{
                fontFamily: "var(--font-poppins)",
                color: "#022B3A",
              }}
            >
              Ticket Routing
            </h3>
            <p
              className="text-sm leading-relaxed"
              style={{
                fontFamily: "var(--font-space-grotesk)",
                color: "#022B3A",
              }}
            >
              Assign task to staff easily determine their ROI, uptime that ensures customer get care they deserve on time.
            </p>
          </Card>

          {/* Asset Insurance Card */}
          <Card className="p-6 bg-card border-none hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 stroke-yellow-400" />
                ))}
                <span
                  className="ml-2 text-sm"
                  style={{
                    fontFamily: "var(--font-space-grotesk)",
                    color: "#022B3A",
                  }}
                >
                  (480)
                </span>
              </div>
              <ArrowUpRight className="w-5 h-5" style={{ color: "#022B3A" }} />
            </div>
            <h3
              className="text-xl font-extrabold mb-3"
              style={{
                fontFamily: "var(--font-poppins)",
                color: "#022B3A",
              }}
            >
              Kiosks & Displays
            </h3>
            <p
              className="text-sm leading-relaxed"
              style={{
                fontFamily: "var(--font-space-grotesk)",
                color: "#022B3A",
              }}
            >
              Control flow of your valuable customers by digital displays that cleans damages and loss.
            </p>
          </Card>
        </div>
        {/* Features Section */}
        <FeaturesSectionDemo />

        {/* How It Works Section */}
        <HowItWorks />

        {/* Infinite Moving Cards Section */}
        <InfiniteMovingCardsDemo />

        {/* CTA and Footer Section */}
        <CtaFooterSection />

      </main>
    </div>
  )
}
