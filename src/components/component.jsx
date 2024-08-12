import React, { useState, useCallback } from 'react';
import Link from "next/link"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import FounderInput from '@/components/FounderInput';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function Component() {
  const [numFounders, setNumFounders] = useState(2);
  const [founders, setFounders] = useState(Array.from({ length: numFounders }, (_, i) => ({ id: i + 1, share: 50 })));
  const [valuation, setValuation] = useState(1000000);
  const [fundingRounds, setFundingRounds] = useState([
    { id: 1, name: 'Round 1', amount: 500000, postValuation: 2500000 }
  ]);
  const [results, setResults] = useState([]);

  const handleNumFoundersChange = useCallback((e) => {
    const newNum = e.target.value;
    setNumFounders(newNum === "" ? "" : Number(newNum));
    if (newNum !== "") {
      setFounders(Array.from({ length: Number(newNum) }, (_, i) => ({
        id: i + 1,
        share: parseFloat((100 / Number(newNum)).toFixed(2)) // Calculate share based on number of founders to two decimal precision
      })));
    }
  }, []);

  const handleFounderShareChange = useCallback((id, value) => {
    const updatedFounders = founders.map(founder => {
      if (founder.id === id) {
        return { ...founder, share: value === "" ? "" : Number(value) };
      }
      return founder;
    });
    setFounders(updatedFounders);
  }, [founders]);
  
  const handleRoundChange = useCallback((index, field, value) => {
    const updatedRounds = fundingRounds.map((round, i) => {
      if (i === index) {
        return { ...round, [field]: value === "" ? "" : Number(value) };
      }
      return round;
    });
    setFundingRounds(updatedRounds);
  }, [fundingRounds]);
  
  const handleValuationChange = useCallback((e) => {
    const value = e.target.value;
    setValuation(value === "" ? "" : Number(value));
  }, []);

  const deleteFundingRound = useCallback((roundId) => {
    setFundingRounds(fundingRounds.filter(round => round.id !== roundId));
  }, [fundingRounds]);

  const addFundingRound = useCallback(() => {
    const newRound = {
      id: fundingRounds.length + 1,
      name: `Round ${fundingRounds.length + 1}`,
      amount: 500000, // Set a default amount that makes sense for your application
      postValuation: 2500000 // Set a default post-valuation that is positive
    };
    setFundingRounds([...fundingRounds, newRound]);
  }, [fundingRounds]);

  const calculateShareholding = useCallback(() => {
    let currentShares = founders.map(founder => ({ ...founder, share: Number(founder.share) }));
    let newResults = [];
  
    fundingRounds.forEach(round => {
      if (round.postValuation <= 0) {
        toast.error(`Post-valuation for round ${round.name} is zero or negative, which is invalid for dilution calculations.`);
        return; // Skip this round or handle it as needed
      }
      const dilution = round.amount / round.postValuation;
      if (isNaN(dilution)) {
        toast.error(`Dilution calculation failed for round ${round.name}. Amount: ${round.amount}, Post-Valuation: ${round.postValuation}`);
        return; // Skip this round or handle it as needed
      }
      currentShares = currentShares.map(founder => ({
        ...founder,
        share: founder.share * (1 - dilution)
      }));
      newResults.push({ round: round.name, data: [...currentShares] });
    });
  
    setResults(newResults);
  }, [founders, fundingRounds]);




  return (
    (<div className="flex flex-col h-full w-full max-w-4xl mx-auto p-6 md:p-8">
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Shareholding Dilution Simulator</h1>
        <Link href="#" className="text-primary hover:underline" prefetch={false}>
          Learn More
        </Link>
      </div>
      <div
        className="bg-background rounded-lg border shadow-sm p-6 md:p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
            <Label htmlFor="num-founders">Number of Founders</Label>
            <Input id="num-founders" type="number" min="1" value={numFounders} onChange={handleNumFoundersChange} />
          </div>
          <div>
            <Label htmlFor="initial-valuation">Initial Valuation</Label>
            <Input id="initial-valuation" type="number" min="0" value={valuation} onChange={handleValuationChange} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {founders.map((founder, index) => (
          <FounderInput key={index} founder={founder} onChange={handleFounderShareChange} />
        ))}
      </div>
        <div className="space-y-4">
          <h2 className="text-lg font-bold">Funding Rounds</h2>
            {fundingRounds.map((round, i) => (
              <div key={i} className="bg-muted rounded-lg p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor={`round-${i + 1}-name`}>Round {i + 1} Name</Label>
                    <Input id={`round-${i + 1}-name`} type="text" value={round.name} onChange={(e) => handleRoundChange(i, 'name', e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor={`round-${i + 1}-amount`}>Fundraise Amount</Label>
                    <Input id={`round-${i + 1}-amount`} type="number" min="0" value={round.amount} onChange={(e) => handleRoundChange(i, 'amount', e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor={`round-${i + 1}-valuation`}>Post-Money Valuation</Label>
                    <Input id={`round-${i + 1}-valuation`} type="number" min="1" value={round.postValuation} onChange={(e) => handleRoundChange(i, 'postValuation', e.target.value)} />
                  </div>
                  <div>
                    <Button onClick={() => deleteFundingRound(round.id)}>Delete</Button>
                  </div>
                </div>
              </div>
            ))}
        </div>
        <div className="flex justify-end gap-2">
          <Button onClick={addFundingRound}>Add Funding Round</Button>
          <Button onClick={calculateShareholding}>Calculate Dilution</Button>
        </div>
      </div>
      <div className="mt-8">
      <h2 className="text-lg font-bold mb-4">Shareholding Breakdown</h2>
      <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Founder
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Initial
            </th>
            {fundingRounds.map((round, index) => (
              <th key={index} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                {round.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {founders.map(founder => (
            <tr key={founder.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                Founder {founder.id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {founder.share.toFixed(2)}%
              </td>
              {results.map(result => (
                <td key={result.round} className="px-6 py-4 whitespace-nowrap">
                  {result.data.find(f => f.id === founder.id)?.share.toFixed(2)}%
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
    </div>)
  );
}
