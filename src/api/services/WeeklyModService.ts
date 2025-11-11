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

    async getAll(): Promise<WeeklyModData[]> {
        return apiClient.get<WeeklyModData[]>(this.getAllEndpoint);
    };

    async create(data: WeeklyModFormData): Promise<any> {
        return apiClient.post(this.createEndpoint, data);
    };
};

export const weeklyService = new WeeklyModService();