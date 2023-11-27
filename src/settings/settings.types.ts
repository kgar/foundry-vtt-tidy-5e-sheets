export type OpenExhaustionConfig = { type: 'open' };

export type ClosedExhaustionConfig = {
  type: 'specific';
  levels: number;
  hints: string[];
};

export type ExhaustionConfig = OpenExhaustionConfig | ClosedExhaustionConfig;
