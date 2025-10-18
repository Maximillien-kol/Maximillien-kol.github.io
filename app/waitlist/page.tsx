import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import Footer from "@/components/ui/footer"
import Link from "next/link"

export default function WaitlistPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#BFDBF7] via-[#F9F9F9] to-[#F9F9F9] flex flex-col">
      {/* Header/Navbar */}
      <header className="container mx-auto px-4 md:px-6 py-6 flex justify-between items-center">
        <Link href="/">
          <div className="flex items-center gap-3 cursor-pointer">
            
            <span 
              className="text-2xl font-extrabold"
              style={{ 
                fontFamily: "var(--font-poppins)", 
                color: "#022B3A" 
              }}
            >
              PillarQ
            </span>
          </div>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 md:py-20">
        <div className="w-full max-w-3xl">
          {/* Section Label */}
          <p 
            className="text-xs md:text-sm tracking-[0.2em] mb-4 uppercase"
            style={{ 
              fontFamily: "var(--font-space-grotesk)", 
              color: "#022B3A",
              opacity: 0.7
            }}
          >
            / JOIN WAITLIST
          </p>

          {/* Heading */}
          <h1 
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-12 md:mb-16"
            style={{ 
              fontFamily: "var(--font-poppins)", 
              color: "#022B3A" 
            }}
          >
            Be the first to try. 
          </h1>

          {/* Form */}
          <form 
            action="https://formbold.com/s/92NM5" 
            method="POST"
            className="space-y-8"
          >
            {/* First Row - Name and Dropdown */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-4">
              <span 
                className="text-lg md:text-xl whitespace-nowrap"
                style={{ 
                  fontFamily: "var(--font-space-grotesk)", 
                  color: "#022B3A" 
                }}
              >
                Hey, my name is
              </span>
              <Input
                type="text"
                name="name"
                placeholder="Type Here"
                required
                className="flex-1 border-b-2 border-t-0 border-l-0 border-r-0 rounded-none bg-transparent px-0 text-lg focus-visible:ring-0 focus-visible:ring-offset-0"
                style={{ 
                  fontFamily: "var(--font-space-grotesk)",
                  color: "#022B3A",
                  borderColor: "#022B3A"
                }}
              />
              <span 
                className="text-lg md:text-xl whitespace-nowrap"
                style={{ 
                  fontFamily: "var(--font-space-grotesk)", 
                  color: "#022B3A" 
                }}
              >
                and I'm looking for
              </span>
              <select
                name="interest"
                required
                className="flex-1 border-b-2 border-t-0 border-l-0 border-r-0 rounded-none bg-transparent px-0 py-2 text-lg focus:outline-none focus:ring-0 cursor-pointer transition-all duration-200 hover:border-opacity-80"
                style={{ 
                  fontFamily: "var(--font-space-grotesk)",
                  color: "#022B3A",
                  borderColor: "#022B3A",
                  appearance: "none",
                  backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23022B3A' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 0.5rem center",
                  backgroundSize: "1.5em 1.5em",
                  paddingRight: "2.5rem"
                }}
              >
                <option value="" disabled style={{ color: "#999" }}>Select an option</option>
                <option value="White-label">White-label Solution</option>
                <option value="demo">Product Demo</option>
                <option value="support">Technical Support</option>
                <option value="partnership">Partnership Opportunity</option>
              </select>
            </div>

            {/* Second Row - Role and Company */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-4">
              <span 
                className="text-lg md:text-xl whitespace-nowrap"
                style={{ 
                  fontFamily: "var(--font-space-grotesk)", 
                  color: "#022B3A" 
                }}
              >
               And I am
              </span>
              <Input
                type="text"
                name="role"
                placeholder="Enter Your Role"
                required
                className="flex-1 border-b-2 border-t-0 border-l-0 border-r-0 rounded-none bg-transparent px-0 text-lg focus-visible:ring-0 focus-visible:ring-offset-0"
                style={{ 
                  fontFamily: "var(--font-space-grotesk)",
                  color: "#022B3A",
                  borderColor: "#022B3A"
                }}
              />
              <span 
                className="text-lg md:text-xl whitespace-nowrap"
                style={{ 
                  fontFamily: "var(--font-space-grotesk)", 
                  color: "#022B3A" 
                }}
              >
                at
              </span>
              <Input
                type="text"
                name="company"
                placeholder="Enter Your Company"
                required
                className="flex-1 border-b-2 border-t-0 border-l-0 border-r-0 rounded-none bg-transparent px-0 text-lg focus-visible:ring-0 focus-visible:ring-offset-0"
                style={{ 
                  fontFamily: "var(--font-space-grotesk)",
                  color: "#022B3A",
                  borderColor: "#022B3A"
                }}
              />
            </div>

            {/* Third Row - Email */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-4">
              <span 
                className="text-lg md:text-xl whitespace-nowrap"
                style={{ 
                  fontFamily: "var(--font-space-grotesk)", 
                  color: "#022B3A" 
                }}
              >
                Secure my spot at
              </span>
              <Input
                type="email"
                name="email"
                placeholder="Your Email Here"
                required
                className="flex-1 border-b-2 border-t-0 border-l-0 border-r-0 rounded-none bg-transparent px-0 text-lg focus-visible:ring-0 focus-visible:ring-offset-0"
                style={{ 
                  fontFamily: "var(--font-space-grotesk)",
                  color: "#022B3A",
                  borderColor: "#022B3A"
                }}
              />
              <span 
                className="text-2xl"
                style={{ color: "#022B3A" }}
              >
                !
              </span>
            </div>

            {/* Checkbox */}
            <div className="flex items-start gap-3 mt-8">
              <Checkbox 
                id="terms"
                name="terms"
                required
                className="mt-1 border-2 rounded-lg data-[state=checked]:bg-[#022B3A] data-[state=checked]:border-[#022B3A]"
                style={{ borderColor: "#022B3A" }}
              />
              <label
                htmlFor="terms"
                className="text-sm md:text-base leading-relaxed cursor-pointer"
                style={{ 
                  fontFamily: "var(--font-space-grotesk)", 
                  color: "#022B3A" 
                }}
              >
                I am here by accept all terms and conditions.
              </label>
            </div>

            {/* Submit Button */}
            <div className="mt-10">
              <Button
                type="submit"
                size="lg"
                className="font-sans px-8"
                style={{
                  backgroundColor: "#022B3A",
                  color: "#F9F9F9",
                  fontFamily: "var(--font-space-grotesk)",
                }}
              >
                Send Enquiry
              </Button>
            </div>
          </form>
        </div>
      </main>

      {/* Footer Section */}
      <Footer />
    </div>
  )
}
