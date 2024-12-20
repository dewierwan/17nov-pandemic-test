import { Bug, Pause, Play, RotateCcw } from 'lucide-react';
import Dashboard from '../shared/components/Dashboard';
import DiseaseParameters from '../shared/components/DiseaseParameters';
import PathogenSelector from '../features/disease/components/PathogenSelector';
import StatisticsGraphs from '../shared/components/StatisticsGraphs';
import PolicySelector from '../features/policies/components/PolicySelector';
import EconomicBreakdown from '../features/economics/components/EconomicBreakdown';
import { useSimulation } from '../features/simulation/hooks/useSimulation';
import { Pathogen, SimulationConfig, ThreatType } from '../types';
import GameOver from '../shared/components/GameOver';
import SimulationSettings from '../shared/components/SimulationSettings';
import LocalContext from '../shared/components/LocalContext';
import BreakingNews from '../shared/components/BreakingNews';
import { useState } from 'react';

function App() {
  const { 
    state, 
    config, 
    reset, 
    toggleSimulation, 
    updateConfig, 
    implementPolicy, 
    usedPolicies,
    activePolicies 
  } = useSimulation();

  const [selectedThreatType, setSelectedThreatType] = useState<'known' | 'custom' | 'mystery'>('known');
  const [selectedPathogenId, setSelectedPathogenId] = useState<string>();

  const handlePathogenSelect = (pathogen: Pathogen) => {
    setSelectedPathogenId(pathogen.id);
    updateConfig({
      ...config,
      transmissionProbability: pathogen.transmissionProbability,
      latentPeriod: pathogen.latentPeriod,
      infectiousPeriod: pathogen.infectiousPeriod,
      mortalityRate: pathogen.mortalityRate
    });
  };

  const handleDateDisplayChange = (useDates: boolean) => {
    updateConfig({
      ...config,
      useDates,
      startDate: useDates ? (config.startDate || new Date()) : undefined
    });
  };

  const handleReset = () => {
    reset();
    setSelectedPathogenId(undefined);
  };

  const handleConfigChange = (newConfig: Partial<SimulationConfig>) => {
    const diseaseParamsChanged = [
      'transmissionProbability',
      'latentPeriod',
      'infectiousPeriod',
      'mortalityRate'
    ].some(param => param in newConfig);

    if (diseaseParamsChanged) {
      setSelectedPathogenId(undefined);
    }
    
    updateConfig({
      ...config,
      ...newConfig
    });
  };

  const handleThreatTypeChange = (type: ThreatType) => {
    setSelectedThreatType(type);
    // Clear selected pathogen when switching modes
    setSelectedPathogenId(undefined);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Bug className="w-8 h-8 text-red-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Disease Simulator</h1>
                <p className="text-gray-600">Simulate the spread of an infectious disease in a population</p>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={toggleSimulation}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                  state.isRunning
                    ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                {state.isRunning ? (
                  <>
                    <Pause className="w-5 h-5" />
                    <span>Pause Simulation</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    <span>Start Simulation</span>
                  </>
                )}
              </button>

              <button
                onClick={handleReset}
                className="flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
              >
                <RotateCcw className="w-5 h-5" />
                <span>Reset Simulation</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 space-y-6 px-4">
        {!state.hasStarted && (
          <>
            <SimulationSettings
              config={config}
              onConfigChange={handleConfigChange}
              disabled={state.isRunning}
            />
            <LocalContext
              config={config}
              onConfigChange={handleConfigChange}
              disabled={state.isRunning}
            />
            <PathogenSelector
              onSelectPathogen={handlePathogenSelect}
              disabled={state.isRunning}
              selectedThreatType={selectedThreatType}
              onThreatTypeChange={handleThreatTypeChange}
              selectedPathogenId={selectedPathogenId}
            />
            {selectedThreatType === 'custom' && (
              <DiseaseParameters
                config={config}
                onConfigChange={handleConfigChange}
                disabled={state.hasStarted}
              />
            )}
          </>
        )}
        
        {state.hasStarted && (
          <>
            <Dashboard 
              state={state} 
            />
            <StatisticsGraphs 
              data={state.timeSeriesData} 
              config={config}
              onDateDisplayChange={handleDateDisplayChange}
            />
          </>
        )}
        
        <PolicySelector 
          onSelectPolicy={implementPolicy}
          usedPolicies={usedPolicies}
          activePolicies={activePolicies}
        />
        <EconomicBreakdown state={state} config={config} />

        {state.isGameOver && (
          <GameOver state={state} onTryAgain={handleReset} />
        )}
      </main>

      <BreakingNews />
    </div>
  );
}

export default App;
