
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
    <Card className="glass-effect border-emerald-500/30">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-emerald-400 text-lg sm:text-xl">
            <History className="w-5 h-5" />
            Calculation History
          </CardTitle>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadHistory}
              className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 text-xs sm:text-sm h-8 sm:h-9"
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
                  className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 text-xs sm:text-sm h-8 sm:h-9"
                >
                  <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  Export
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearHistory}
                  className="border-orange-500/30 text-orange-400 hover:bg-orange-500/20 text-xs sm:text-sm h-8 sm:h-9"
                >
                  <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  Clear History
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAllData}
                  className="border-red-500/30 text-red-400 hover:bg-red-500/20 text-xs sm:text-sm h-8 sm:h-9"
                >
                  <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  Clear All Data
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-3 sm:px-6">
        {history.length === 0 ? (
          <div className="text-center py-6 sm:py-8 text-slate-400">
            <History className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 opacity-50" />
            <p className="text-sm sm:text-base">No calculations saved yet</p>
            <p className="text-xs sm:text-sm">Your last 10 calculations will appear here</p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {history.map((item, index) => (
              <div
                key={index}
                className="p-3 sm:p-4 bg-slate-800/30 rounded-lg border border-slate-700/50 hover:border-emerald-500/30 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={item.tradeType === 'long' ? 'default' : 'destructive'}
                      className={`${item.tradeType === 'long' ? 'bg-green-600' : 'bg-red-600'} text-xs sm:text-sm`}
                    >
                      {item.tradeType === 'long' ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                      {item.tradeType.toUpperCase()}
                    </Badge>
                    <span className="text-slate-400 text-xs sm:text-sm">
                      {formatDate(item.timestamp)}
                    </span>
                  </div>
                  <div className="text-emerald-400 font-semibold text-sm sm:text-base">
                    ${item.entryPrice.toFixed(2)}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 text-xs sm:text-sm">
                  <div>
                    <div className="text-slate-400">Risk Amount</div>
                    <div className="text-emerald-400 font-semibold">${item.riskAmount.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-slate-400">Position Size</div>
                    <div className="text-emerald-400 font-semibold">${item.positionSize.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-slate-400">Stop Loss %</div>
                    <div className="text-emerald-400 font-semibold">{item.distanceToStopLoss.toFixed(2)}%</div>
                  </div>
                  <div>
                    <div className="text-slate-400">Leverage</div>
                    <div className="text-emerald-400 font-semibold">{item.leverage.toFixed(2)}x</div>
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
