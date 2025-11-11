import { useState } from "react"
import { weeklyService, type WeeklyModFormData } from "../api/services/WeeklyModService";

export const useCreateWeeklyMod = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createWeeklyMod = async (formData: WeeklyModFormData) => {
        try {
            setLoading(true);
            setError(null);
            const response = await weeklyService.create(formData);
            return response;
        } catch (error: any) {
            const errorMessage = error instanceof Error ? error.message : "Error al crear el registro";
            setError(errorMessage);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return {
        createWeeklyMod,
        loading,
        error,
        resetError: () => setError(null)
    };
};