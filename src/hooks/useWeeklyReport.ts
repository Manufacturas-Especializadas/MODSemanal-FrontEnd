import { useState } from "react";
import { reportService } from "../api/services/ReportService";

export const useWeeklyReport = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const generateReport = async (weekNumber: number) => {
        try {
            setLoading(true);
            setError(null);
            await reportService.generateWeeklyReport(weekNumber);
        } catch (err: any) {
            const errorMessage = err instanceof Error ? err.message : 'Error al generar el reporte';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const clearError = () => {
        setError(null);
    };

    return {
        generateReport,
        loading,
        error,
        clearError
    };
};