import { useState } from 'react';
import { Shield, ChevronDown, ChevronUp } from 'lucide-react';
import { policyOptions } from '../../../data/policyDefinitions';
import { PolicyOption } from '../../../types';
import { PolicyCard } from './PolicyCard';
import { useSimulationStore } from '../../../features/simulation/store/simulationStore';

interface PolicySelectorProps {
  onSelectPolicy: (policy: PolicyOption) => void;
  usedPolicies: Set<string>;
  activePolicies: Set<string>;
}

export default function PolicySelector({ onSelectPolicy, usedPolicies, activePolicies }: PolicySelectorProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const { state } = useSimulationStore();

  if (!state.hasStarted) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between mb-4"
      >
        <div className="flex items-center space-x-2">
          <Shield className="w-6 h-6 text-indigo-600" />
          <h2 className="text-xl font-bold">Policy Options</h2>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>
      
      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {policyOptions.map((policy) => (
            <PolicyCard
              key={policy.id}
              policy={policy}
              onSelect={() => onSelectPolicy(policy)}
              isUsed={usedPolicies.has(policy.id)}
              isActive={activePolicies.has(policy.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
