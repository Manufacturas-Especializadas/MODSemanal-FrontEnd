import type React from "react";
import { useCreateWeeklyMod } from "../../hooks/useCreateWeeklyMod";
import { useEffect, useState } from "react";
import type { WeeklyModFormData } from "../../api/services/WeeklyModService";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import type { WeeklyModData } from "../../types/WeeklyModData";

interface CreateWeeklyModFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    editingWeek?: number | null;
    existingData?: WeeklyModData[];
};

export const CreateWeeklyModForm: React.FC<CreateWeeklyModFormProps> = ({
    isOpen,
    onClose,
    onSuccess,
    editingWeek = null,
    existingData = []
}) => {
    const { createWeeklyMod, updateWeeklyMod, loading, error, resetError } = useCreateWeeklyMod();

    const [formData, setFormData] = useState<WeeklyModFormData>({
        weekNumber: 0,
        cuData: {
            productivityTarget: 0,
            productionVolume: 0,
            mod: 0
        },
        alData: {
            productivityTarget: 0,
            productionVolume: 0,
            mod: 0
        }
    });

    useEffect(() => {
        if (isOpen && editingWeek && existingData.length > 0) {
            const cuData = existingData.find(item => item.materialType === "CU");
            const alData = existingData.find(item => item.materialType === "AL");

            setFormData({
                weekNumber: editingWeek,
                cuData: {
                    productivityTarget: cuData?.productivityTarget || 0,
                    productionVolume: cuData?.productionVolume || 0,
                    mod: cuData?.mod || 0
                },
                alData: {
                    productivityTarget: alData?.productivityTarget || 0,
                    productionVolume: alData?.productionVolume || 0,
                    mod: alData?.mod || 0
                }
            });
        } else if (isOpen) {
            setFormData({
                weekNumber: 0,
                cuData: { productivityTarget: 0, productionVolume: 0, mod: 0 },
                alData: { productivityTarget: 0, productionVolume: 0, mod: 0 }
            });
        }
    }, [isOpen, editingWeek, existingData]);

    const handleInputChange = (
        section: 'cuData' | 'alData' | "general",
        field: string,
        value: number
    ) => {
        if (section === 'general') {
            setFormData(prev => ({
                ...prev,
                [field]: value
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [section]: {
                    ...prev[section],
                    [field]: value
                }
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        resetError();

        try {
            if (editingWeek) {
                await updateWeeklyMod(editingWeek, formData);
            } else {
                await createWeeklyMod(formData);
            }
            onSuccess();
            onClose();
        } catch (err) {
        }
    };

    const handleClose = () => {
        resetError();
        onClose();
    };

    return (
        <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/50" aria-hidden="true">
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <DialogPanel className="mx-auto max-w-2xl w-full bg-white rounded-lg shadow-xl">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <DialogTitle className="text-xl font-semibold text-gray-900">
                                Registrar datos semanales MOD
                            </DialogTitle>
                            <button
                                onClick={handleClose}
                                className="text-gray-400 hover:text-gray-600 transition-colors hover:cursor-pointer"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {
                                error && (
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                        <p className="text-red-800 text-sm">
                                            {error}
                                        </p>
                                    </div>
                                )
                            }

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Número de semana
                                </label>
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    value={formData.weekNumber || ""}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        weekNumber: parseInt(e.target.value) || 0
                                    }))}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2
                                    focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            {/* Sección CU */}
                            <div className="border border-gray-200 rounded-lg p-4">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">
                                    Datos Cobre (CU)
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Meta Productividad
                                        </label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            value={formData.cuData.productivityTarget || ''}
                                            onChange={(e) => handleInputChange('cuData', 'productivityTarget', parseFloat(e.target.value) || 0)}
                                            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 
                                            focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Volumen Producción
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.cuData.productionVolume || ''}
                                            onChange={(e) => handleInputChange('cuData', 'productionVolume', parseInt(e.target.value) || 0)}
                                            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 
                                            focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            MOD
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.cuData.mod || ''}
                                            onChange={(e) => handleInputChange('cuData', 'mod', parseInt(e.target.value) || 0)}
                                            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 
                                            focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Sección AL */}
                            <div className="border border-gray-200 rounded-lg p-4">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">
                                    Datos Aluminio (AL)
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Meta Productividad
                                        </label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            value={formData.alData.productivityTarget || ''}
                                            onChange={(e) => handleInputChange('alData', 'productivityTarget', parseFloat(e.target.value) || 0)}
                                            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 
                                            focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Volumen Producción
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.alData.productionVolume || ''}
                                            onChange={(e) => handleInputChange('alData', 'productionVolume', parseInt(e.target.value) || 0)}
                                            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 
                                            focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            MOD
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.alData.mod || ''}
                                            onChange={(e) => handleInputChange('alData', 'mod', parseInt(e.target.value) || 0)}
                                            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 
                                            focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    disabled={loading}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg
                                    hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50
                                    hover:cursor-pointer"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg 
                                    hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50
                                    hover:cursor-pointer"
                                >
                                    {loading ? "Guardando..." : "Guardar"}
                                </button>
                            </div>
                        </form>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    );
};