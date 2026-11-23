export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function modifiedBanisterTrimp(
  samples: Array<{ durationMinutes: number; heartRate: number }>,
  restingHeartRate: number,
  maxHeartRate: number,
  sex: "male" | "female" = "male",
) {
  const b = sex === "male" ? 1.92 : 1.67;
  return samples.reduce((total, sample) => {
    const delta = clamp(
      (sample.heartRate - restingHeartRate) /
        (maxHeartRate - restingHeartRate),
      0,
      1,
    );
    return total + sample.durationMinutes * delta * Math.exp(b * delta);
  }, 0);
}

export function trimpToStrain(trimp: number) {
  return clamp(21 * (1 - Math.exp(-0.012 * trimp)), 0, 21);
}

export function rollingLogRmssdZScore(
  todayRmssd: number,
  historyRmssd: number[],
) {
  if (!historyRmssd.length) return null;
  const logs = historyRmssd.map((value) => Math.log(value)).filter(Number.isFinite);
  if (!logs.length) return null;
  const mean = logs.reduce((sum, value) => sum + value, 0) / logs.length;
  const variance =
    logs.reduce((sum, value) => sum + (value - mean) ** 2, 0) / logs.length;
  const stdDev = Math.sqrt(variance);
  if (stdDev === 0) return 0;
  return (Math.log(todayRmssd) - mean) / stdDev;
}

export function recoveryScore(
  todayRmssd: number,
  historyRmssd: number[],
  sleepingRhr?: number,
  historyRhr?: number[],
) {
  const z = rollingLogRmssdZScore(todayRmssd, historyRmssd);
  if (z === null) return null;
  let score = clamp(z * 16.67 + 50, 0, 100);
  if (sleepingRhr !== undefined && historyRhr?.length) {
    const baselineRhr =
      historyRhr.reduce((sum, value) => sum + value, 0) / historyRhr.length;
    if (sleepingRhr > baselineRhr) {
      score -= clamp((sleepingRhr - baselineRhr) * 3, 0, 20);
    }
  }
  return clamp(score, 0, 100);
}

export function rollingMedian(values: number[], windowSize = 5) {
  const radius = Math.floor(windowSize / 2);
  return values.map((value, index) => {
    const start = Math.max(0, index - radius);
    const end = Math.min(values.length, index + radius + 1);
    const window = values.slice(start, end).sort((a, b) => a - b);
    return window[Math.floor(window.length / 2)];
  });
}

export function filterRrArtifacts(rrIntervalsMs: number[]) {
  const median = rollingMedian(rrIntervalsMs, 5);
  return rrIntervalsMs.map((value, index) => ({
    value,
    median: median[index],
    artifact: median[index] === 0
      ? false
      : Math.abs(value - median[index]) / median[index] > 0.2,
  }));
}

export function fosterSrpe(rpe: number, durationMinutes: number) {
  return rpe * durationMinutes;
}
