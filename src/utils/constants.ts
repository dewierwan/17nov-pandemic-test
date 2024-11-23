// Vaccination constants
export const VACCINATION_CONSTANTS = {
  INITIAL_COST: 10_000_000_000, // $10B initial R&D cost
  DAILY_CAPACITY_PERCENTAGE: 0.01, // 1% of population per day
} as const;

// Simulation defaults
export const SIMULATION_DEFAULTS = {
  POPULATION: 100_000_000,
  MORTALITY_RATE: 0.05,
  INFECTIOUS_PERIOD: 8,
  DAYS_PER_SECOND: 10,
  ECONOMIC_COST_PER_DEATH: 1_000_000,
  GAMMA: 1/14,
  CONTACTS_PER_DAY: 10,
  TRANSMISSION_PROBABILITY: 0.015,
  LATENT_PERIOD: 5
} as const; 