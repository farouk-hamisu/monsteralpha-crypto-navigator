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
        <Card className="glass-effect border-emerald-500/30">
          <CardHeader className="text-center pb-4">
            <CardTitle className="flex items-center justify-center gap-2 text-emerald-400 text-lg sm:text-xl">
              <Calculator className="w-5 h-5" />
              Trading Parameters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4 px-3 sm:px-6">
            {/* Total Capital */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="totalCapital" className="text-slate-200 text-sm sm:text-base">Total Capital ($)</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-4 h-4 text-emerald-400 cursor-help" />
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
                className="bg-slate-800 border-slate-600 text-slate-100 focus:border-emerald-500 h-10 sm:h-11 text-sm sm:text-base"
                placeholder="Enter total capital"
              />
            </div>

            {/* Risk Percentage */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="riskPercentage" className="text-slate-200 text-sm sm:text-base">Risk Percentage (%)</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-4 h-4 text-emerald-400 cursor-help" />
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
                className="bg-slate-800 border-slate-600 text-slate-100 focus:border-emerald-500 h-10 sm:h-11 text-sm sm:text-base"
                placeholder="Enter risk percentage"
              />
            </div>

            {/* Trade Type */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label className="text-slate-200 text-sm sm:text-base">Trade Type</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-4 h-4 text-emerald-400 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Long: Buy low, sell high | Short: Sell high, buy low</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Select value={data.tradeType} onValueChange={(value: 'long' | 'short') => handleInputChange('tradeType', value)}>
                <SelectTrigger className="bg-slate-800 border-slate-600 text-slate-100 h-10 sm:h-11 text-sm sm:text-base">
                  <SelectValue placeholder="Select trade type" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="long" className="text-slate-100 focus:bg-emerald-600 text-sm sm:text-base">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      Long
                    </div>
                  </SelectItem>
                  <SelectItem value="short" className="text-slate-100 focus:bg-emerald-600 text-sm sm:text-base">
                    <div className="flex items-center gap-2">
                      <TrendingDown className="w-4 h-4 text-red-500" />
                      Short
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Entry Price */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="entryPrice" className="text-slate-200 text-sm sm:text-base">Entry Price ($)</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-4 h-4 text-emerald-400 cursor-help" />
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
                className="bg-slate-800 border-slate-600 text-slate-100 focus:border-emerald-500 h-10 sm:h-11 text-sm sm:text-base"
                placeholder="Enter entry price"
              />
            </div>

            {/* Stop Loss Price */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="stopLossPrice" className="text-slate-200 text-sm sm:text-base">Stop Loss Price ($)</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-4 h-4 text-emerald-400 cursor-help" />
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
                className="bg-slate-800 border-slate-600 text-slate-100 focus:border-emerald-500 h-10 sm:h-11 text-sm sm:text-base"
                placeholder="Enter stop loss price"
              />
            </div>

            {/* Trade Amount */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="tradeAmount" className="text-slate-200 text-sm sm:text-base">Trade Amount ($)</Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-4 h-4 text-emerald-400 cursor-help" />
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
                className="bg-slate-800 border-slate-600 text-slate-100 focus:border-emerald-500 h-10 sm:h-11 text-sm sm:text-base"
                placeholder="Enter trade amount"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
              <Button 
                onClick={saveCalculation}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white glow-effect transition-all duration-300 h-10 sm:h-11 text-sm sm:text-base"
              >
                Save Calculation
              </Button>
              <Button 
                onClick={clearInputs}
                variant="outline"
                className="flex-1 border-red-500/30 text-red-400 hover:bg-red-500/20 h-10 sm:h-11 text-sm sm:text-base"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Clear Inputs
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        <Card className="glass-effect border-emerald-500/30">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-emerald-400 text-lg sm:text-xl">Calculation Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 px-3 sm:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="bg-slate-800/50 p-3 sm:p-4 rounded-lg neon-border">
                <div className="text-slate-400 text-xs sm:text-sm">Risk Amount</div>
                <div className="text-emerald-400 text-lg sm:text-xl font-bold">
                  ${results.riskAmount.toFixed(2)}
                </div>
              </div>
              
              <div className="bg-slate-800/50 p-3 sm:p-4 rounded-lg neon-border">
                <div className="text-slate-400 text-xs sm:text-sm">Distance to Stop Loss</div>
                <div className="text-emerald-400 text-lg sm:text-xl font-bold">
                  {results.distanceToStopLoss.toFixed(2)}%
                </div>
              </div>
              
              <div className="bg-slate-800/50 p-3 sm:p-4 rounded-lg neon-border">
                <div className="text-slate-400 text-xs sm:text-sm">Position Size</div>
                <div className="text-emerald-400 text-lg sm:text-xl font-bold">
                  ${results.positionSize.toFixed(2)}
                </div>
              </div>
              
              <div className="bg-slate-800/50 p-3 sm:p-4 rounded-lg neon-border">
                <div className="text-slate-400 text-xs sm:text-sm">Leverage</div>
                <div className="text-emerald-400 text-lg sm:text-xl font-bold">
                  {results.leverage.toFixed(2)}x
                </div>
              </div>
            </div>

            <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-slate-800/30 rounded-lg border border-emerald-500/20">
              <h4 className="text-emerald-400 font-semibold mb-2 text-sm sm:text-base">Formula Reference:</h4>
              <div className="text-slate-300 text-xs sm:text-sm space-y-1">
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
