import React, { useState } from 'react';
import { TrendingUp, Award, Wallet, Activity, CheckCircle2 } from 'lucide-react';

type Sport = 'football' | 'basketball' | 'tennis' | 'mma';

interface MatchOpportunity {
  id: string;
  sport: Sport;
  event: string;
  league: string;
  bookmaker: '1xBet' | 'PremierBet' | 'Betclic' | 'Bet365';
  odds: number;
  aiProbability: number;
  metricLabel: string;
  metricValue: string;
}

const MOCK_MATCHES: MatchOpportunity[] = [
  {
    id: '1',
    sport: 'football',
    event: 'PSG vs Arsenal',
    league: 'UEFA Champions League',
    bookmaker: '1xBet',
    odds: 2.10,
    aiProbability: 0.58,
    metricLabel: 'Modèle Poisson xG',
    metricValue: 'xG Domicile: 2.1 - Extérieur: 0.9'
  },
  {
    id: '2',
    sport: 'basketball',
    event: 'Boston Celtics vs LA Lakers',
    league: 'NBA Regular Season',
    bookmaker: 'PremierBet',
    odds: 1.95,
    aiProbability: 0.62,
    metricLabel: 'Pace & Rating Index',
    metricValue: 'Offensive Rating: 118.4 (+6.2 vs Spread)'
  },
  {
    id: '3',
    sport: 'tennis',
    event: 'Alcaraz vs Sinner',
    league: 'Roland Garros Final',
    bookmaker: 'Betclic',
    odds: 2.25,
    aiProbability: 0.52,
    metricLabel: 'Surface Index (Terre)',
    metricValue: 'Hold/Break Ratio: 84% / 31%'
  },
  {
    id: '4',
    sport: 'mma',
    event: 'Makhachev vs Tsarukyan',
    league: 'UFC Main Event',
    bookmaker: 'Bet365',
    odds: 1.85,
    aiProbability: 0.68,
    metricLabel: 'Striking vs Grappling',
    metricValue: 'Takedown Def: 88% - Control 12m+'
  }
];

export default function App() {
  const [bankroll, setBankroll] = useState<number>(10000);
  const [riskFactor, setRiskFactor] = useState<number>(0.25);
  const [selectedSport, setSelectedSport] = useState<Sport | 'all'>('all');
  const [simulatedBets, setSimulatedBets] = useState<string[]>([]);

  const calculateKellyStake = (odds: number, probability: number) => {
    const b = odds - 1;
    const p = probability;
    const q = 1 - p;
    const fullKelly = (b * p - q) / b;
    
    if (fullKelly <= 0) return { stakeAmount: 0, stakePercent: 0 };
    
    const adjustedFraction = fullKelly * riskFactor;
    const stakeAmount = bankroll * adjustedFraction;
    const stakePercent = adjustedFraction * 100;

    return {
      stakeAmount: Math.round(stakeAmount),
      stakePercent: Math.round(stakePercent * 10) / 10
    };
  };

  const handlePlaceBet = (id: string) => {
    if (!simulatedBets.includes(id)) {
      setSimulatedBets([...simulatedBets, id]);
    }
  };

  const filteredMatches = selectedSport === 'all' 
    ? MOCK_MATCHES 
    : MOCK_MATCHES.filter(m => m.sport === selectedSport);

  return (
    <div className="min-h-screen bg-[#070a12] text-gray-100 p-4 md:p-8">
      <header className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between pb-8 border-b border-gray-800 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight flex items-center gap-3">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#10b981] via-[#3b82f6] to-[#8b5cf6]">
              SUPER BOOKMAKERS IA
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/30 rounded-full">
              Engine v2.4
            </span>
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Algorithmes d'Optimisation Mathématique +EV & Gestionnaire Kelly
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 bg-[#0d1322] p-3 rounded-xl border border-gray-800">
          <div>
            <label className="text-xs text-gray-400 block font-medium">Bankroll (FCFA)</label>
            <input 
              type="number" 
              value={bankroll} 
              onChange={(e) => setBankroll(Number(e.target.value))}
              className="bg-[#070a12] border border-gray-700 text-white font-bold px-3 py-1 rounded-lg w-32 text-sm focus:border-[#3b82f6] outline-none"
            />
          </div>
          <div>
            <label className="text-xs text-gray-400 block font-medium">Gestion du Risque</label>
            <select 
              value={riskFactor}
              onChange={(e) => setRiskFactor(Number(e.target.value))}
              className="bg-[#070a12] border border-gray-700 text-white text-sm px-3 py-1 rounded-lg outline-none focus:border-[#3b82f6]"
            >
              <option value={0.25}>Quarter Kelly (25% - Prudent)</option>
              <option value={0.50}>Half Kelly (50% - Modéré)</option>
              <option value={1.00}>Full Kelly (100% - Agressif)</option>
            </select>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 my-8">
        <div className="bg-[#0d1322] p-5 rounded-2xl border border-gray-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-medium">Solde Disponible</p>
            <p className="text-2xl font-black text-white mt-1">{bankroll.toLocaleString()} FCFA</p>
          </div>
          <div className="p-3 bg-[#3b82f6]/10 text-[#3b82f6] rounded-xl">
            <Wallet className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-[#0d1322] p-5 rounded-2xl border border-gray-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-medium">Opportunités +EV</p>
            <p className="text-2xl font-black text-[#10b981] mt-1">{filteredMatches.length} Détectées</p>
          </div>
          <div className="p-3 bg-[#10b981]/10 text-[#10b981] rounded-xl">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-[#0d1322] p-5 rounded-2xl border border-gray-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-medium">Moyenne +EV %</p>
            <p className="text-2xl font-black text-[#8b5cf6] mt-1">+16.4 %</p>
          </div>
          <div className="p-3 bg-[#8b5cf6]/10 text-[#8b5cf6] rounded-xl">
            <Activity className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-[#0d1322] p-5 rounded-2xl border border-gray-800 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-400 font-medium">Paris Enregistrés</p>
            <p className="text-2xl font-black text-white mt-1">{simulatedBets.length}</p>
          </div>
          <div className="p-3 bg-gray-800 text-gray-300 rounded-xl">
            <Award className="w-6 h-6" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mb-6 flex flex-wrap items-center gap-2 overflow-x-auto pb-2">
        <button 
          onClick={() => setSelectedSport('all')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${selectedSport === 'all' ? 'bg-[#3b82f6] text-white' : 'bg-[#0d1322] text-gray-400 border border-gray-800 hover:border-gray-700'}`}
        >
          Tous les Sports
        </button>
        <button 
          onClick={() => setSelectedSport('football')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${selectedSport === 'football' ? 'bg-[#10b981] text-white' : 'bg-[#0d1322] text-gray-400 border border-gray-800 hover:border-gray-700'}`}
        >
          ⚽ Football
        </button>
        <button 
          onClick={() => setSelectedSport('basketball')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${selectedSport === 'basketball' ? 'bg-[#8b5cf6] text-white' : 'bg-[#0d1322] text-gray-400 border border-gray-800 hover:border-gray-700'}`}
        >
          🏀 Basketball (NBA)
        </button>
        <button 
          onClick={() => setSelectedSport('tennis')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${selectedSport === 'tennis' ? 'bg-[#3b82f6] text-white' : 'bg-[#0d1322] text-gray-400 border border-gray-800 hover:border-gray-700'}`}
        >
          🎾 Tennis
        </button>
        <button 
          onClick={() => setSelectedSport('mma')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${selectedSport === 'mma' ? 'bg-red-500 text-white' : 'bg-[#0d1322] text-gray-400 border border-gray-800 hover:border-gray-700'}`}
        >
          🥊 MMA / UFC
        </button>
      </div>

      <main className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredMatches.map((match) => {
          const ev = Math.round(((match.aiProbability * match.odds) - 1) * 100 * 10) / 10;
          const { stakeAmount, stakePercent } = calculateKellyStake(match.odds, match.aiProbability);
          const isPlaced = simulatedBets.includes(match.id);

          return (
            <div 
              key={match.id} 
              className="bg-[#0d1322] rounded-2xl p-6 border border-gray-800 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400 bg-gray-800/60 px-2.5 py-1 rounded-md">
                    {match.league}
                  </span>
                  <span className="text-xs font-bold px-2 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {match.bookmaker}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2">{match.event}</h3>

                <div className="bg-[#070a12] p-3 rounded-xl border border-gray-800/80 mb-4">
                  <p className="text-xs font-semibold text-[#8b5cf6]">{match.metricLabel}</p>
                  <p className="text-xs text-gray-300 mt-0.5">{match.metricValue}</p>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center py-3 bg-[#070a12]/50 rounded-xl mb-4 border border-gray-800/40">
                  <div>
                    <span className="text-[10px] text-gray-400 block uppercase">Cote Bookmaker</span>
                    <span className="text-lg font-black text-white">{match.odds.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 block uppercase">Probabilité IA</span>
                    <span className="text-lg font-black text-[#3b82f6]">{(match.aiProbability * 100).toFixed(0)}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 block uppercase">Valeur Espérée</span>
                    <span className="text-lg font-black text-[#10b981]">+{ev}%</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-800/60 flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-400 block">Mise Conseillée (Kelly)</span>
                  <span className="text-sm font-bold text-white">
                    {stakeAmount.toLocaleString()} FCFA <span className="text-xs text-[#10b981] font-normal">({stakePercent}%)</span>
                  </span>
                </div>

                <button
                  onClick={() => handlePlaceBet(match.id)}
                  disabled={isPlaced}
                  className={`px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${
                    isPlaced 
                      ? 'bg-gray-800 text-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-[#10b981] to-[#3b82f6] text-white hover:opacity-90 shadow-lg shadow-[#10b981]/10'
                  }`}
                >
                  {isPlaced ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-[#10b981]" /> Pari Enregistré
                    </>
                  ) : (
                    'Placer le Pari'
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </main>
    </div>
  );
}
