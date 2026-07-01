"use client";

import { useState } from "react";
import { Calculator, Percent, Calendar, Landmark, BadgePercent } from "lucide-react";
import { formatAED } from "@/lib/utils";

interface MortgageCalculatorProps {
  propertyPrice: number;
}

export default function MortgageCalculator({ propertyPrice }: MortgageCalculatorProps) {
  const [price, setPrice] = useState(propertyPrice);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [interestRate, setInterestRate] = useState(4.5);
  const [tenureYears, setTenureYears] = useState(25);

  const downPayment = Math.round((price * downPaymentPercent) / 100);
  const loanAmount = price - downPayment;

  // Monthly interest rate
  const r = (interestRate / 100) / 12;
  // Total months
  const n = tenureYears * 12;

  // Amortization calculation
  // Monthly payment M = P [ r(1+r)^n ] / [ (1+r)^n - 1 ]
  let monthlyPayment = 0;
  if (loanAmount > 0) {
    if (r === 0) {
      monthlyPayment = loanAmount / n;
    } else {
      monthlyPayment = (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    }
  }

  const totalPayment = monthlyPayment * n;
  const totalInterest = totalPayment - loanAmount;

  return (
    <div className="bg-luxury-dark border border-luxury-border/30 rounded-3xl p-6 sm:p-8 shadow-luxury space-y-6">
      <div>
        <span className="text-[9px] uppercase tracking-widest text-luxury-gold font-bold">Advisory Tools</span>
        <h3 className="font-serif text-xl text-white mt-0.5">Mortgage Calculator</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Side Sliders */}
        <div className="space-y-5">
          {/* Property Price */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400 font-light">Property Valuation (AED)</span>
              <span className="text-white font-medium">{formatAED(price)}</span>
            </div>
            <input
              type="range"
              min={Math.round(propertyPrice * 0.5)}
              max={Math.round(propertyPrice * 2.0)}
              step={50000}
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full accent-luxury-gold cursor-pointer"
            />
          </div>

          {/* Down Payment Percent */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400 font-light">Down Payment ({downPaymentPercent}%)</span>
              <span className="text-white font-medium">{formatAED(downPayment)}</span>
            </div>
            <input
              type="range"
              min={10}
              max={50}
              step={5}
              value={downPaymentPercent}
              onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
              className="w-full accent-luxury-gold cursor-pointer"
            />
          </div>

          {/* Interest Rate Percent */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400 font-light">Annual Interest Rate</span>
              <span className="text-white font-medium">{interestRate.toFixed(2)}%</span>
            </div>
            <input
              type="range"
              min={2.0}
              max={8.0}
              step={0.1}
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              className="w-full accent-luxury-gold cursor-pointer"
            />
          </div>

          {/* Loan Tenure years */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400 font-light">Amortization Tenure</span>
              <span className="text-white font-medium">{tenureYears} Years</span>
            </div>
            <input
              type="range"
              min={5}
              max={30}
              step={5}
              value={tenureYears}
              onChange={(e) => setTenureYears(Number(e.target.value))}
              className="w-full accent-luxury-gold cursor-pointer"
            />
          </div>
        </div>

        {/* Right Side Stats Result cards */}
        <div className="grid grid-cols-2 gap-4">
          {/* Monthly Payment (Large focal) */}
          <div className="col-span-2 bg-[#1f232c]/50 rounded-2xl p-5 border border-luxury-border/15 flex flex-col justify-between">
            <div>
              <Landmark className="w-5 h-5 text-luxury-gold mb-2" />
              <span className="text-[9px] uppercase tracking-widest text-gray-500 font-bold block mb-1">Estimated Monthly Payment</span>
            </div>
            <span className="text-2xl sm:text-3xl font-serif text-luxury-gold font-bold">
              {formatAED(Math.round(monthlyPayment))}
            </span>
          </div>

          {/* Loan Amount */}
          <div className="bg-[#1f232c]/50 rounded-2xl p-4 border border-luxury-border/15">
            <BadgePercent className="w-4 h-4 text-luxury-gold mb-1" />
            <span className="text-[8px] uppercase tracking-widest text-gray-500 block mb-0.5">Loan Amount</span>
            <span className="text-sm font-serif text-white font-bold block">
              {formatAED(loanAmount)}
            </span>
          </div>

          {/* Total Interest */}
          <div className="bg-[#1f232c]/50 rounded-2xl p-4 border border-luxury-border/15">
            <Percent className="w-4 h-4 text-luxury-gold mb-1" />
            <span className="text-[8px] uppercase tracking-widest text-gray-500 block mb-0.5">Total Interest</span>
            <span className="text-sm font-serif text-white font-bold block">
              {formatAED(Math.round(totalInterest))}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
