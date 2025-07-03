
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Download, TrendingUp, TrendingDown, History } from 'lucide-react';

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

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('monsteralpha-history') || '[]');
    setHistory(savedHistory);
  }, []);

  const clearHistory = () => {
    localStorage.removeItem('monsteralpha-history');
    setHistory([]);
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
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-emerald-400">
            <History className="w-5 h-5" />
            Calculation History
          </CardTitle>
          <div className="flex gap-2">
            {history.length > 0 && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportHistory}
                  className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Export
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearHistory}
                  className="border-red-500/30 text-red-400 hover:bg-red-500/20"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Clear
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {history.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <History className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>No calculations saved yet</p>
            <p className="text-sm">Your last 5 calculations will appear here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((item, index) => (
              <div
                key={index}
                className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50 hover:border-emerald-500/30 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={item.tradeType === 'long' ? 'default' : 'destructive'}
                      className={item.tradeType === 'long' ? 'bg-green-600' : 'bg-red-600'}
                    >
                      {item.tradeType === 'long' ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                      {item.tradeType.toUpperCase()}
                    </Badge>
                    <span className="text-slate-400 text-sm">
                      {formatDate(item.timestamp)}
                    </span>
                  </div>
                  <div className="text-emerald-400 font-semibold">
                    ${item.entryPrice.toFixed(2)}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
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
