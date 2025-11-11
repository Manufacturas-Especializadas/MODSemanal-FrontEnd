import { API_CONFIG } from "../../config/api";
import { apiClient } from "../client";


class ReportService {
    private baseEndpoint = API_CONFIG.endpoint.weeklyMod.downloadReport;

    async generateWeeklyReport(weekNumber: number): Promise<void> {
        try {
            const filename = `Reporte_Semana_${weekNumber}_${new Date().toISOString().slice(0, 10)}.xlsx`;
            await apiClient.downloadFile(`${this.baseEndpoint}/${weekNumber}`, filename);
        } catch (error) {
            console.error('Error en reportService:', error);
            throw error;
        }
    }
}

export const reportService = new ReportService();