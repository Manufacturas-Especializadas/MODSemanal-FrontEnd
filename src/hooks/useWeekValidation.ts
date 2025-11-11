import { useState, useCallback } from "react";
import { weeklyService } from "../api/services/WeeklyModService";

export const useWeekValidation = () => {
    const [existingWeeks, setExistingWeeks] = useState<number[]>([]);

    const getAllWeeks = useCallback(async () => {
        try {
            const weeks = await weeklyService.getAll();
            setExistingWeeks(weeks.map((w) => w.weekNumber));
        } catch (error) {
            console.error("Error fetching weeks:", error);
        }
    }, []);

    const getNextAvailableWeek = useCallback(() => {
        if (existingWeeks.length === 0) return 1;
        const maxWeek = Math.max(...existingWeeks);
        return maxWeek + 1 <= 53 ? maxWeek + 1 : 1;
    }, [existingWeeks]);

    const isWeekExists = useCallback(
        (weekNumber: number) => existingWeeks.includes(weekNumber),
        [existingWeeks]
    );

    return {
        existingWeeks,
        getNextAvailableWeek,
        isWeekExists,
        refetchWeeks: getAllWeeks,
    };
};
