
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Download, TrendingUp, TrendingDown, History, RefreshCw } from 'lucide-react';

interface HistoryItem {
  totalCapital: number;
  riskPercentage: number;
  entryPrice: number;
  stopLossPrice: number;
  tradeAmount: number;
  tradeType: 'long' | 'short';
  riskAmount: number;
  distanceToStopLoss: number;
  positionSize: number;
  leverage: number;
  timestamp: string;
}

const CalculationHistory = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const loadHistory = () => {
    const savedHistory = JSON.parse(localStorage.getItem('monsteralpha-history') || '[]');
    setHistory(savedHistory);
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const clearHistory = () => {
    localStorage.removeItem('monsteralpha-history');
    setHistory([]);
  };

  const clearAllData = () => {
    // Clear both history and user inputs
    localStorage.removeItem('monsteralpha-history');
    localStorage.removeItem('monsteralpha-inputs');
    setHistory([]);
    // Reload the page to reset the input form
    window.location.reload();
  };

  const exportHistory = () => {
    const dataStr = JSON.stringify(history, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'monsteralpha-calculations.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="premium-glass-card border-slate-600/40 shadow-xl backdrop-blur-lg">
      <CardHeader className="text-center pb-4 bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-t-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-slate-100 text-lg sm:text-xl font-semibold">
            <History className="w-5 h-5 text-teal-400" />
            Calculation History
          </CardTitle>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadHistory}
              className="border-slate-500/50 bg-slate-700/30 text-slate-300 hover:bg-slate-600/50 hover:text-slate-100 hover:border-slate-400/70 transition-all duration-300 ease-in-out transform hover:scale-105 text-xs sm:text-sm h-8 sm:h-9"
            >
              <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              Refresh
            </Button>
            {history.length > 0 && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportHistory}
                  className="border-slate-500/50 bg-slate-700/30 text-slate-300 hover:bg-slate-600/50 hover:text-slate-100 hover:border-slate-400/70 transition-all duration-300 ease-in-out transform hover:scale-105 text-xs sm:text-sm h-8 sm:h-9"
                >
                  <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  Export
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearHistory}
                  className="border-orange-500/50 bg-orange-600/20 text-orange-300 hover:bg-orange-500/30 hover:text-orange-100 hover:border-orange-400/70 transition-all duration-300 ease-in-out transform hover:scale-105 text-xs sm:text-sm h-8 sm:h-9"
                >
                  <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  Clear History
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAllData}
                  className="border-red-500/50 bg-red-600/20 text-red-300 hover:bg-red-500/30 hover:text-red-100 hover:border-red-400/70 transition-all duration-300 ease-in-out transform hover:scale-105 text-xs sm:text-sm h-8 sm:h-9"
                >
                  <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  Clear All Data
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-4 sm:px-6 py-6 bg-gradient-to-br from-slate-800/80 to-slate-900/90">
        {history.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/70 p-8 rounded-lg border border-slate-600/30 backdrop-blur-sm">
              <History className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 text-slate-400 opacity-50" />
              <p className="text-slate-300 text-base sm:text-lg font-medium mb-2">No calculations saved yet</p>
              <p className="text-slate-400 text-sm sm:text-base">Your last 10 calculations will appear here</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4 sm:space-y-5">
            {history.map((item, index) => (
              <div
                key={index}
                className="premium-result-card bg-gradient-to-br from-slate-700/50 to-slate-800/70 p-4 sm:p-5 rounded-lg border border-slate-600/30 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/10 animate-fade-in"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
                  <div className="flex items-center gap-3">
                    <Badge 
                      variant={item.tradeType === 'long' ? 'default' : 'destructive'}
                      className={`${item.tradeType === 'long' ? 'bg-emerald-600/80 hover:bg-emerald-500/80' : 'bg-red-600/80 hover:bg-red-500/80'} text-white border-0 text-sm sm:text-base px-3 py-1 transition-all duration-300`}
                    >
                      {item.tradeType === 'long' ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                      {item.tradeType.toUpperCase()}
                    </Badge>
                    <span className="text-slate-400 text-sm sm:text-base">
                      {formatDate(item.timestamp)}
                    </span>
                  </div>
                  <div className="text-teal-300 font-bold text-lg sm:text-xl">
                    ${item.entryPrice.toFixed(2)}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-600/20">
                    <div className="text-slate-400 text-xs sm:text-sm font-medium mb-1">Risk Amount</div>
                    <div className="text-teal-300 font-bold text-sm sm:text-base">${item.riskAmount.toFixed(2)}</div>
                  </div>
                  <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-600/20">
                    <div className="text-slate-400 text-xs sm:text-sm font-medium mb-1">Position Size</div>
                    <div className="text-teal-300 font-bold text-sm sm:text-base">${item.positionSize.toFixed(2)}</div>
                  </div>
                  <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-600/20">
                    <div className="text-slate-400 text-xs sm:text-sm font-medium mb-1">Stop Loss %</div>
                    <div className="text-teal-300 font-bold text-sm sm:text-base">{item.distanceToStopLoss.toFixed(2)}%</div>
                  </div>
                  <div className="bg-slate-800/50 p-3 rounded-lg border border-slate-600/20">
                    <div className="text-slate-400 text-xs sm:text-sm font-medium mb-1">Leverage</div>
                    <div className="text-teal-300 font-bold text-sm sm:text-base">{item.leverage.toFixed(2)}x</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CalculationHistory;
