import Navbar from '@/sections/Navbar'
import HeroSection from '@/sections/HeroSection'
import PlatformsSection from '@/sections/PlatformsSection'
import MarketsSection from '@/sections/MarketsSection'
import AppShowcase from '@/sections/AppShowcase'
import FeaturesSection from '@/sections/FeaturesSection'
import AwardsSection from '@/sections/AwardsSection'
import PartnershipSection from '@/sections/PartnershipSection'
import ReviewsSection from '@/sections/ReviewsSection'
import AxiSelectSection from '@/sections/AxiSelectSection'
import EducationSection from '@/sections/EducationSection'
import HelpSection from '@/sections/HelpSection'
import Footer from '@/sections/Footer'
import ChatFAB from '@/sections/ChatFAB'
import WhatsAppButton from '@/sections/WhatsAppButton'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-14 md:pt-24">
        <HeroSection />
        <PlatformsSection />
        <MarketsSection />
        <AppShowcase />
        <FeaturesSection />
        <AwardsSection />
        <PartnershipSection />
        <ReviewsSection />
        <AxiSelectSection />
        <EducationSection />
        <HelpSection />
        <Footer />
        <ChatFAB />
        <WhatsAppButton />
      </div>
    </div>
  )
}