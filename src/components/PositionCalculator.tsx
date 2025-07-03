import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info, Calculator, TrendingUp, TrendingDown } from 'lucide-react';

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
  const [data, setData] = useState<CalculationData>({
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
    setData(prev => ({
      ...prev,
      [field]: typeof value === 'string' ? parseFloat(value) || 0 : value
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
    
    // Keep only last 5 calculations
    const updatedHistory = history.slice(0, 5);
    localStorage.setItem('monsteralpha-history', JSON.stringify(updatedHistory));
  };

  return (
    <TooltipProvider>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card className="glass-effect border-emerald-500/30">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-emerald-400">
              <Calculator className="w-5 h-5" />
              Trading Parameters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Total Capital */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="totalCapital" className="text-slate-200">Total Capital ($)</Label>
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
                className="bg-slate-800 border-slate-600 text-slate-100 focus:border-emerald-500"
                placeholder="Enter total capital"
              />
            </div>

            {/* Risk Percentage */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="riskPercentage" className="text-slate-200">Risk Percentage (%)</Label>
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
                className="bg-slate-800 border-slate-600 text-slate-100 focus:border-emerald-500"
                placeholder="Enter risk percentage"
              />
            </div>

            {/* Trade Type */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label className="text-slate-200">Trade Type</Label>
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
                <SelectTrigger className="bg-slate-800 border-slate-600 text-slate-100">
                  <SelectValue placeholder="Select trade type" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  <SelectItem value="long" className="text-slate-100 focus:bg-emerald-600">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      Long
                    </div>
                  </SelectItem>
                  <SelectItem value="short" className="text-slate-100 focus:bg-emerald-600">
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
                <Label htmlFor="entryPrice" className="text-slate-200">Entry Price ($)</Label>
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
                className="bg-slate-800 border-slate-600 text-slate-100 focus:border-emerald-500"
                placeholder="Enter entry price"
              />
            </div>

            {/* Stop Loss Price */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="stopLossPrice" className="text-slate-200">Stop Loss Price ($)</Label>
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
                className="bg-slate-800 border-slate-600 text-slate-100 focus:border-emerald-500"
                placeholder="Enter stop loss price"
              />
            </div>

            {/* Trade Amount */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="tradeAmount" className="text-slate-200">Trade Amount ($)</Label>
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
                className="bg-slate-800 border-slate-600 text-slate-100 focus:border-emerald-500"
                placeholder="Enter trade amount"
              />
            </div>

            <Button 
              onClick={saveCalculation}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white glow-effect transition-all duration-300"
            >
              Save Calculation
            </Button>
          </CardContent>
        </Card>

        {/* Results Section */}
        <Card className="glass-effect border-emerald-500/30">
          <CardHeader className="text-center">
            <CardTitle className="text-emerald-400">Calculation Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800/50 p-4 rounded-lg neon-border">
                <div className="text-slate-400 text-sm">Risk Amount</div>
                <div className="text-emerald-400 text-xl font-bold">
                  ${results.riskAmount.toFixed(2)}
                </div>
              </div>
              
              <div className="bg-slate-800/50 p-4 rounded-lg neon-border">
                <div className="text-slate-400 text-sm">Distance to Stop Loss</div>
                <div className="text-emerald-400 text-xl font-bold">
                  {results.distanceToStopLoss.toFixed(2)}%
                </div>
              </div>
              
              <div className="bg-slate-800/50 p-4 rounded-lg neon-border">
                <div className="text-slate-400 text-sm">Position Size</div>
                <div className="text-emerald-400 text-xl font-bold">
                  ${results.positionSize.toFixed(2)}
                </div>
              </div>
              
              <div className="bg-slate-800/50 p-4 rounded-lg neon-border">
                <div className="text-slate-400 text-sm">Leverage</div>
                <div className="text-emerald-400 text-xl font-bold">
                  {results.leverage.toFixed(2)}x
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-slate-800/30 rounded-lg border border-emerald-500/20">
              <h4 className="text-emerald-400 font-semibold mb-2">Formula Reference:</h4>
              <div className="text-slate-300 text-sm space-y-1">
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
