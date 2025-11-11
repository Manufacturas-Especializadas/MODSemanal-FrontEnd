import { API_CONFIG } from "../../config/api";
import type { WeeklyModData } from "../../types/WeeklyModData";
import { apiClient } from "../client";

export interface WeeklyModFormData {
    weekNumber: number;
    cuData: {
        productivityTarget: number;
        productionVolume: number;
        mod: number;
    };
    alData: {
        productivityTarget: number;
        productionVolume: number;
        mod: number
    };
};

class WeeklyModService {
    private getAllEndpoint = API_CONFIG.endpoint.weeklyMod.getAll;
    private createEndpoint = API_CONFIG.endpoint.weeklyMod.create;
    private updateEndpoint = API_CONFIG.endpoint.weeklyMod.update;

    async getAll(): Promise<WeeklyModData[]> {
        return apiClient.get<WeeklyModData[]>(this.getAllEndpoint);
    };

    async getExistingWeeks(): Promise<number[]> {
        const data = await this.getAll();
        const weeks = Array.from(new Set(data.map(item => item.weekNumber)));

        return weeks.sort((a, b) => a - b);
    };

    async create(data: WeeklyModFormData): Promise<any> {
        return apiClient.post(this.createEndpoint, data);
    };

    async update(weekNumber: number, data: WeeklyModFormData): Promise<any> {
        return apiClient.put(`${this.updateEndpoint}${weekNumber}`, data);
    };
};

export const weeklyService = new WeeklyModService();