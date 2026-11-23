export type Sport =
  | "Trail Run"
  | "Bouldering"
  | "Sport Climbing"
  | "Cycling"
  | "Swimming"
  | "Strength";

export type DemoDay = {
  date: string;
  recovery: number;
  rmssd: number;
  rhr: number;
  breathingRate: number;
  ansCharge: "Very good" | "Good" | "Fair" | "Weak";
  sleepCharge: "Good" | "Fair" | "Weak";
  sleepScore: number;
  sleepEfficiency: number;
  sleepDurationMinutes: number;
  bedMinutes: number;
  strain: number;
  exercises: Array<{
    sport: Sport;
    name: string;
    durationMinutes: number;
    strain: number | null;
    srpe: number | null;
  }>;
};

const sports: Sport[] = [
  "Trail Run",
  "Bouldering",
  "Cycling",
  "Sport Climbing",
  "Strength",
  "Swimming",
];

export function generateDemoData(days = 30, seed = 2300): DemoDay[] {
  let state = seed >>> 0;
  const random = () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 4294967296;
  };
  const result: DemoDay[] = [];
  for (let index = 29; index >= 0; index--) {
    const date = new Date("2026-11-23T12:00:00.000Z");
    date.setUTCDate(date.getUTCDate() - index);
    const cycle = Math.sin(index * 1.17);
    const recovery = Math.round(63 + cycle * 11 + random() * 12);
    const sleepScore = Math.round(68 + cycle * 8 + random() * 16);
    const sport = sports[(30 - index) % sports.length];
    const isRest = index % 7 === 0;
    const neuromuscular = sport === "Bouldering" || sport === "Sport Climbing" || sport === "Strength";
    const exercises = isRest
      ? []
      : [{
          sport,
          name: neuromuscular
            ? sport === "Strength"
              ? "Full body strength"
              : "Power & technique"
            : sport === "Trail Run"
              ? "Threshold trail run"
              : sport === "Cycling"
                ? "Tempo ride"
                : "Aerobic swim",
          durationMinutes: neuromuscular
            ? 65 + Math.floor(random() * 30)
            : 45 + Math.floor(random() * 55),
          strain: neuromuscular ? null : Number((8.4 + random() * 7.2).toFixed(1)),
          srpe: neuromuscular ? 7 * (neuromuscular ? 65 : 1) : null,
        }];
    const strain = isRest
      ? Number((random() * 2.5).toFixed(1))
      : Number((6.2 + random() * 9).toFixed(1));
    result.push({
      date: date.toISOString().slice(0, 10),
      recovery,
      rmssd: Math.round(44 + recovery * 0.22 + random() * 8),
      rhr: Math.round(49 - (recovery - 65) * 0.12 + random() * 3),
      breathingRate: Number((13.6 + random() * 2).toFixed(1)),
      ansCharge: recovery > 78 ? "Very good" : recovery > 68 ? "Good" : recovery > 58 ? "Fair" : "Weak",
      sleepCharge: sleepScore > 80 ? "Good" : sleepScore > 65 ? "Fair" : "Weak",
      sleepScore,
      sleepEfficiency: Math.round(82 + random() * 13),
      sleepDurationMinutes: Math.round(420 + random() * 90),
      bedMinutes: Math.round(500 + random() * 50),
      strain,
      exercises,
    });
  }
  return result.slice(-days);
}
