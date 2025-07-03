
import React, { useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PositionCalculator from '@/components/PositionCalculator';
import CalculationHistory from '@/components/CalculationHistory';
import TradingViewWidget from '@/components/TradingViewWidget';
import PWAInstallBanner from '@/components/PWAInstallBanner';
import { Calculator, History, Zap } from 'lucide-react';

const Index = () => {
  useEffect(() => {
    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration);
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* PWA Install Banner */}
      <PWAInstallBanner />
      
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        {/* Header with Logo */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-4">
            <img 
              src="/lovable-uploads/b69fc652-9707-410d-91f0-870ac5aa8ff8.png" 
              alt="MonsterAlpha Logo" 
              className="w-12 h-12 sm:w-16 sm:h-16 animate-pulse-glow"
            />
            <div className="text-center sm:text-left">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">
                MonsterAlpha
              </h1>
              <p className="text-slate-400 text-base sm:text-lg">Crypto Position Calculator</p>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 text-emerald-400">
            <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-xs sm:text-sm font-medium">Advanced Trading Risk Management</span>
            <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>

        {/* TradingView Price Ticker */}
        <div className="mb-4 sm:mb-6">
          <TradingViewWidget />
        </div>

        {/* Main Content */}
        <Tabs defaultValue="calculator" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-800 border-slate-700 h-10 sm:h-12">
            <TabsTrigger 
              value="calculator" 
              className="flex items-center gap-2 data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-xs sm:text-sm"
            >
              <Calculator className="w-3 h-3 sm:w-4 sm:h-4" />
              Calculator
            </TabsTrigger>
            <TabsTrigger 
              value="history" 
              className="flex items-center gap-2 data-[state=active]:bg-emerald-600 data-[state=active]:text-white text-xs sm:text-sm"
            >
              <History className="w-3 h-3 sm:w-4 sm:h-4" />
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calculator" className="mt-4 sm:mt-6">
            <PositionCalculator />
          </TabsContent>

          <TabsContent value="history" className="mt-4 sm:mt-6">
            <CalculationHistory />
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="text-center mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-slate-700">
          <p className="text-slate-400 text-xs sm:text-sm">
            Built with <span className="text-emerald-400">MonsterAlpha</span> precision • 
            Advanced crypto trading calculations
          </p>
          <div className="flex items-center justify-center gap-2 sm:gap-4 mt-2 text-xs text-slate-500 flex-wrap">
            <span>Risk Management</span>
            <span>•</span>
            <span>Position Sizing</span>
            <span>•</span>
            <span>Real-time Data</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
