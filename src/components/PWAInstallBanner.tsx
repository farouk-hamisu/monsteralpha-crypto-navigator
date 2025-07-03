
import React from 'react';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import { X, Download, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PWAInstallBanner = () => {
  const { shouldShowPrompt, installApp, dismissPrompt } = usePWAInstall();

  if (!shouldShowPrompt) return null;

  const handleInstall = async () => {
    const installed = await installApp();
    if (!installed) {
      // If native prompt failed, show instructions for manual installation
      console.log('Native install failed, user should install manually');
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-1">
            <div className="flex items-center gap-2">
              <Smartphone className="w-5 h-5 flex-shrink-0" />
              <img 
                src="/lovable-uploads/b69fc652-9707-410d-91f0-870ac5aa8ff8.png" 
                alt="MonsterAlpha" 
                className="w-6 h-6 flex-shrink-0"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium leading-tight">
                Add MonsterAlpha to Home Screen
              </p>
              <p className="text-xs opacity-90 leading-tight">
                Quick access to your crypto position calculator
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              onClick={handleInstall}
              size="sm"
              variant="secondary"
              className="bg-white text-emerald-700 hover:bg-emerald-50 text-xs px-3 py-1.5 h-auto"
            >
              <Download className="w-3 h-3 mr-1" />
              Install
            </Button>
            <Button
              onClick={dismissPrompt}
              size="sm"
              variant="ghost"
              className="text-white hover:bg-emerald-800 p-1.5 h-auto"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallBanner;
