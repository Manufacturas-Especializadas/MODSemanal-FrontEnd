export interface WeeklyMod {
    id: number;
    weekNumber: number;
    materialType: string;
    productivityTarget: number;
    productionVolume: number;
    hoursNeed: number;
    mod: number;
    hoursPersonAvailable: number;
    excessPersonHours: number;
    excessHoursPerPerson: number;
};

export interface WeeklyModIndexProps {
    data?: WeeklyMod[];
    loading?: boolean;
    error?: string | null;
};