export const EXPERIMENT_EXIT_CODES = {
  success: 0,
  dataOrRuntime: 1,
  usage: 2,
} as const;

export class ExperimentUsageError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "ExperimentUsageError";
  }
}

export class ExperimentDataError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "ExperimentDataError";
  }
}

export function experimentExitCode(error: unknown): 1 | 2 {
  return error instanceof ExperimentUsageError
    ? EXPERIMENT_EXIT_CODES.usage
    : EXPERIMENT_EXIT_CODES.dataOrRuntime;
}
