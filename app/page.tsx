import { Header } from '@/components/layout/Header';
import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { PricingSection } from '@/components/landing/PricingSection';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F3F4F6]">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <PricingSection />
      </main>
      <footer className="border-t border-gray-200 py-12 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-600">
            <p>&copy; 2024 VideoAI. All rights reserved.</p>
            <div className="mt-4 flex justify-center gap-6">
              <a href="#" className="hover:text-gray-900 transition-colors font-medium">Privacy Policy</a>
              <a href="#" className="hover:text-gray-900 transition-colors font-medium">Terms of Service</a>
              <a href="#" className="hover:text-gray-900 transition-colors font-medium">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
