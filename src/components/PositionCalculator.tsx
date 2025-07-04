import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info, Calculator, TrendingUp, TrendingDown, Trash2 } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface CalculationData {
  totalCapital: number;
  riskPercentage: number;
  entryPrice: number;
  stopLossPrice: number;
  tradeAmount: number;
  tradeType: 'long' | 'short';
}

interface CalculationResults {
  riskAmount: number;
  distanceToStopLoss: number;
  positionSize: number;
  leverage: number;
}

const PositionCalculator = () => {
  // Use localStorage for user inputs
  const [data, setData, clearData] = useLocalStorage<CalculationData>('monsteralpha-inputs', {
    totalCapital: 0,
    riskPercentage: 0,
    entryPrice: 0,
    stopLossPrice: 0,
    tradeAmount: 0,
    tradeType: 'long'
  });

  const [results, setResults] = useState<CalculationResults>({
    riskAmount: 0,
    distanceToStopLoss: 0,
    positionSize: 0,
    leverage: 0
  });

  const calculateResults = () => {
    const { totalCapital, riskPercentage, entryPrice, stopLossPrice, tradeAmount, tradeType } = data;
    
    // Risk Amount = Total Capital × Risk Percentage
    const riskAmount = (totalCapital * riskPercentage) / 100;
    
    // Distance to Stop Loss calculation based on trade type
    let distanceToStopLoss = 0;
    if (tradeType === 'long') {
      distanceToStopLoss = entryPrice > 0 ? ((entryPrice - stopLossPrice) / entryPrice) * 100 : 0;
    } else {
      distanceToStopLoss = entryPrice > 0 ? ((stopLossPrice - entryPrice) / entryPrice) * 100 : 0;
    }
    
    // Position Size = Risk Amount ÷ Distance to Stop Loss
    const positionSize = distanceToStopLoss > 0 ? riskAmount / (distanceToStopLoss / 100) : 0;
    
    // Leverage = Position Size ÷ Trade Amount
    const leverage = tradeAmount > 0 ? positionSize / tradeAmount : 0;

    setResults({
      riskAmount,
      distanceToStopLoss: Math.abs(distanceToStopLoss),
      positionSize,
      leverage
    });
  };

  useEffect(() => {
    calculateResults();
  }, [data]);

  const handleInputChange = (field: keyof CalculationData, value: string | number) => {
    const numericValue = typeof value === 'string' ? parseFloat(value) || 0 : value;
    setData(prev => ({
      ...prev,
      [field]: numericValue
    }));
  };

  const saveCalculation = () => {
    const calculation = {
      ...data,
      ...results,
      timestamp: new Date().toISOString()
    };
    
    const history = JSON.parse(localStorage.getItem('monsteralpha-history') || '[]');
    history.unshift(calculation);
    
    // Keep only last 10 calculations
    const updatedHistory = history.slice(0, 10);
    localStorage.setItem('monsteralpha-history', JSON.stringify(updatedHistory));
  };

  const clearInputs = () => {
    clearData();
  };

  return (
    <TooltipProvider>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        {/* Input Section */}
        <Card className="premium-glass-card border-slate-600/40 shadow-xl backdrop-blur-lg">
          <CardHeader className="text-center pb-4 bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-t-lg">
            <CardTitle className="flex items-center justify-center gap-2 text-slate-100 text-lg sm:text-xl font-semibold">
              <Calculator className="w-5 h-5 text-teal-400" />
              Trading Parameters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-5 px-4 sm:px-6 py-6 bg-gradient-to-br from-slate-800/80 to-slate-900/90">
            {/* Total Capital */}
            <div className="space-y-2 animate-fade-in">
              <div className="flex items-center gap-2">
                <Label htmlFor="totalCapital" className="text-slate-200 text-sm sm:text-base font-medium">Total Capital ($)</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-4 h-4 text-teal-400 cursor-help hover:text-teal-300 transition-colors duration-200" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Your total available trading capital</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Input
                id="totalCapital"
                type="number"
                value={data.totalCapital || ''}
                onChange={(e) => handleInputChange('totalCapital', e.target.value)}
                className="bg-slate-700/60 border-slate-600/50 text-slate-100 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 h-11 sm:h-12 text-sm sm:text-base transition-all duration-300 ease-in-out backdrop-blur-sm"
                placeholder="Enter total capital"
              />
            </div>

            {/* Risk Percentage */}
            <div className="space-y-2 animate-fade-in">
              <div className="flex items-center gap-2">
                <Label htmlFor="riskPercentage" className="text-slate-200 text-sm sm:text-base font-medium">Risk Percentage (%)</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-4 h-4 text-teal-400 cursor-help hover:text-teal-300 transition-colors duration-200" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Percentage of capital you're willing to risk on this trade</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Input
                id="riskPercentage"
                type="number"
                value={data.riskPercentage || ''}
                onChange={(e) => handleInputChange('riskPercentage', e.target.value)}
                className="bg-slate-700/60 border-slate-600/50 text-slate-100 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 h-11 sm:h-12 text-sm sm:text-base transition-all duration-300 ease-in-out backdrop-blur-sm"
                placeholder="Enter risk percentage"
              />
            </div>

            {/* Trade Type */}
            <div className="space-y-2 animate-fade-in">
              <div className="flex items-center gap-2">
                <Label className="text-slate-200 text-sm sm:text-base font-medium">Trade Type</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-4 h-4 text-teal-400 cursor-help hover:text-teal-300 transition-colors duration-200" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Long: Buy low, sell high | Short: Sell high, buy low</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Select value={data.tradeType} onValueChange={(value: 'long' | 'short') => handleInputChange('tradeType', value)}>
                <SelectTrigger className="bg-slate-700/60 border-slate-600/50 text-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 h-11 sm:h-12 text-sm sm:text-base transition-all duration-300 ease-in-out backdrop-blur-sm hover:bg-slate-700/80">
                  <SelectValue placeholder="Select trade type" className="text-white" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700/95 border-slate-600/60 backdrop-blur-lg shadow-2xl">
                  <SelectItem 
                    value="long" 
                    className="text-slate-100 hover:bg-teal-600/80 hover:text-white focus:bg-teal-600/80 focus:text-white data-[highlighted]:bg-teal-600/80 data-[highlighted]:text-white data-[state=checked]:text-white text-sm sm:text-base transition-all duration-200 ease-in-out"
                  >
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                      <span>Long</span>
                    </div>
                  </SelectItem>
                  <SelectItem 
                    value="short" 
                    className="text-slate-100 hover:bg-teal-600/80 hover:text-white focus:bg-teal-600/80 focus:text-white data-[highlighted]:bg-teal-600/80 data-[highlighted]:text-white data-[state=checked]:text-white text-sm sm:text-base transition-all duration-200 ease-in-out"
                  >
                    <div className="flex items-center gap-2">
                      <TrendingDown className="w-4 h-4 text-red-400" />
                      <span>Short</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Entry Price */}
            <div className="space-y-2 animate-fade-in">
              <div className="flex items-center gap-2">
                <Label htmlFor="entryPrice" className="text-slate-200 text-sm sm:text-base font-medium">Entry Price ($)</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-4 h-4 text-teal-400 cursor-help hover:text-teal-300 transition-colors duration-200" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>The price at which you plan to enter the trade</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Input
                id="entryPrice"
                type="number"
                value={data.entryPrice || ''}
                onChange={(e) => handleInputChange('entryPrice', e.target.value)}
                className="bg-slate-700/60 border-slate-600/50 text-slate-100 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 h-11 sm:h-12 text-sm sm:text-base transition-all duration-300 ease-in-out backdrop-blur-sm"
                placeholder="Enter entry price"
              />
            </div>

            {/* Stop Loss Price */}
            <div className="space-y-2 animate-fade-in">
              <div className="flex items-center gap-2">
                <Label htmlFor="stopLossPrice" className="text-slate-200 text-sm sm:text-base font-medium">Stop Loss Price ($)</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-4 h-4 text-teal-400 cursor-help hover:text-teal-300 transition-colors duration-200" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>The price at which you'll exit to limit losses</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Input
                id="stopLossPrice"
                type="number"
                value={data.stopLossPrice || ''}
                onChange={(e) => handleInputChange('stopLossPrice', e.target.value)}
                className="bg-slate-700/60 border-slate-600/50 text-slate-100 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 h-11 sm:h-12 text-sm sm:text-base transition-all duration-300 ease-in-out backdrop-blur-sm"
                placeholder="Enter stop loss price"
              />
            </div>

            {/* Trade Amount */}
            <div className="space-y-2 animate-fade-in">
              <div className="flex items-center gap-2">
                <Label htmlFor="tradeAmount" className="text-slate-200 text-sm sm:text-base font-medium">Trade Amount ($)</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-4 h-4 text-teal-400 cursor-help hover:text-teal-300 transition-colors duration-200" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>The amount you want to invest in this trade</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Input
                id="tradeAmount"
                type="number"
                value={data.tradeAmount || ''}
                onChange={(e) => handleInputChange('tradeAmount', e.target.value)}
                className="bg-slate-700/60 border-slate-600/50 text-slate-100 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 h-11 sm:h-12 text-sm sm:text-base transition-all duration-300 ease-in-out backdrop-blur-sm"
                placeholder="Enter trade amount"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button 
                onClick={saveCalculation}
                className="flex-1 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-500 hover:to-teal-600 text-white shadow-lg hover:shadow-teal-500/25 transition-all duration-300 ease-in-out transform hover:scale-105 h-11 sm:h-12 text-sm sm:text-base font-medium"
              >
                Save Calculation
              </Button>
              <Button 
                onClick={clearInputs}
                variant="outline"
                className="flex-1 border-slate-500/50 bg-slate-700/30 text-slate-300 hover:bg-slate-600/50 hover:text-slate-100 hover:border-slate-400/70 transition-all duration-300 ease-in-out transform hover:scale-105 h-11 sm:h-12 text-sm sm:text-base"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear Inputs
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        <Card className="premium-glass-card border-slate-600/40 shadow-xl backdrop-blur-lg">
          <CardHeader className="text-center pb-4 bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-t-lg">
            <CardTitle className="text-slate-100 text-lg sm:text-xl font-semibold">Calculation Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 px-4 sm:px-6 py-6 bg-gradient-to-br from-slate-800/80 to-slate-900/90">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="premium-result-card bg-gradient-to-br from-slate-700/50 to-slate-800/70 p-4 rounded-lg border border-slate-600/30 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/10">
                <div className="text-slate-400 text-xs sm:text-sm font-medium">Risk Amount</div>
                <div className="text-teal-300 text-xl sm:text-2xl font-bold transition-all duration-500 ease-in-out">
                  ${results.riskAmount.toFixed(2)}
                </div>
              </div>
              
              <div className="premium-result-card bg-gradient-to-br from-slate-700/50 to-slate-800/70 p-4 rounded-lg border border-slate-600/30 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/10">
                <div className="text-slate-400 text-xs sm:text-sm font-medium">Distance to Stop Loss</div>
                <div className="text-teal-300 text-xl sm:text-2xl font-bold transition-all duration-500 ease-in-out">
                  {results.distanceToStopLoss.toFixed(2)}%
                </div>
              </div>
              
              <div className="premium-result-card bg-gradient-to-br from-slate-700/50 to-slate-800/70 p-4 rounded-lg border border-slate-600/30 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/10">
                <div className="text-slate-400 text-xs sm:text-sm font-medium">Position Size</div>
                <div className="text-teal-300 text-xl sm:text-2xl font-bold transition-all duration-500 ease-in-out">
                  ${results.positionSize.toFixed(2)}
                </div>
              </div>
              
              <div className="premium-result-card bg-gradient-to-br from-slate-700/50 to-slate-800/70 p-4 rounded-lg border border-slate-600/30 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:shadow-teal-500/10">
                <div className="text-slate-400 text-xs sm:text-sm font-medium">Leverage</div>
                <div className="text-teal-300 text-xl sm:text-2xl font-bold transition-all duration-500 ease-in-out">
                  {results.leverage.toFixed(2)}x
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gradient-to-br from-slate-700/40 to-slate-800/60 rounded-lg border border-slate-600/30 backdrop-blur-sm">
              <h4 className="text-teal-300 font-semibold mb-3 text-sm sm:text-base">Formula Reference:</h4>
              <div className="text-slate-300 text-xs sm:text-sm space-y-1.5 leading-relaxed">
                <div>• Risk Amount = Total Capital × Risk %</div>
                <div>• Distance to SL = |(Entry - Stop Loss) / Entry| × 100</div>
                <div>• Position Size = Risk Amount ÷ (Distance to SL / 100)</div>
                <div>• Leverage = Position Size ÷ Trade Amount</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
};

export default PositionCalculator;
