import type React from "react";
import { useCreateWeeklyMod } from "../../hooks/useCreateWeeklyMod";
import { useWeekValidation } from "../../hooks/useWeekValidation";
import { useEffect, useState, useMemo, useCallback } from "react";
import type { WeeklyModFormData } from "../../api/services/WeeklyModService";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import type { WeeklyModData } from "../../types/WeeklyModData";

interface CreateWeeklyModFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    editingWeek?: number | null;
    existingData?: WeeklyModData[];
}

export const CreateWeeklyModForm: React.FC<CreateWeeklyModFormProps> = ({
    isOpen,
    onClose,
    onSuccess,
    editingWeek = null,
    existingData = []
}) => {
    const { createWeeklyMod, updateWeeklyMod, loading, error, resetError } = useCreateWeeklyMod();
    const { getNextAvailableWeek, isWeekExists, existingWeeks, refetchWeeks } = useWeekValidation();

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

    const [weekError, setWeekError] = useState<string | null>(null);

    const isEditing = Boolean(editingWeek);

    const nextAvailableWeek = useMemo(() => getNextAvailableWeek(), [getNextAvailableWeek]);

    const handleIntegerChange = useCallback((value: string, min: number = 0): number => {
        if (value === '' || value === '-' || isNaN(Number(value))) {
            return min;
        }

        const numValue = parseInt(value, 10);
        return isNaN(numValue) ? min : Math.max(min, numValue);
    }, []);

    const handleDecimalChange = useCallback((value: string, min: number = 0): number => {
        if (value === '' || value === '-' || value === '.' || isNaN(Number(value))) {
            return min;
        }

        const numValue = parseFloat(value);
        return isNaN(numValue) ? min : Math.max(min, numValue);
    }, []);

    const handleWeekNumberChange = useCallback((value: string) => {
        const weekValue = handleIntegerChange(value, 1);
        setFormData(prev => ({
            ...prev,
            weekNumber: weekValue
        }));
    }, [handleIntegerChange]);

    const handleUseNextWeek = useCallback(() => {
        setFormData(prev => ({
            ...prev,
            weekNumber: nextAvailableWeek
        }));
        setWeekError(null);
    }, [nextAvailableWeek]);

    const handleInputChange = useCallback((
        section: 'cuData' | 'alData',
        field: string,
        value: string,
        isDecimal: boolean = false
    ) => {
        const processedValue = isDecimal
            ? handleDecimalChange(value, field === 'productivityTarget' ? 0.1 : 0)
            : handleIntegerChange(value, 1);

        setFormData(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: processedValue
            }
        }));
    }, [handleDecimalChange, handleIntegerChange]);

    useEffect(() => {
        if (!isOpen) return;

        resetError();
        setWeekError(null);

        // 🔹 Solo llamamos al backend cuando el modal se abre
        if (!isEditing) {
            refetchWeeks();
        }

        if (isEditing && existingData.length > 0) {
            const cuData = existingData.find((item) => item.materialType === "CU");
            const alData = existingData.find((item) => item.materialType === "AL");

            setFormData({
                weekNumber: editingWeek || 0,
                cuData: {
                    productivityTarget: cuData?.productivityTarget || 0,
                    productionVolume: cuData?.productionVolume || 0,
                    mod: cuData?.mod || 0,
                },
                alData: {
                    productivityTarget: alData?.productivityTarget || 0,
                    productionVolume: alData?.productionVolume || 0,
                    mod: alData?.mod || 0,
                },
            });
        } else {
            setFormData({
                weekNumber: nextAvailableWeek,
                cuData: { productivityTarget: 0, productionVolume: 0, mod: 0 },
                alData: { productivityTarget: 0, productionVolume: 0, mod: 0 },
            });
        }
    }, [isOpen]);


    useEffect(() => {
        if (!isEditing && formData.weekNumber > 0) {
            if (isWeekExists(formData.weekNumber)) {
                setWeekError(`La semana ${formData.weekNumber} ya está registrada.`);
            } else {
                setWeekError(null);
            }
        } else {
            setWeekError(null);
        }
    }, [formData.weekNumber, isEditing, isWeekExists]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        resetError();
        setWeekError(null);

        if (!isEditing && isWeekExists(formData.weekNumber)) {
            setWeekError(`No se puede registrar. La semana ${formData.weekNumber} ya existe.`);
            return;
        }

        try {
            if (isEditing && editingWeek) {
                await updateWeeklyMod(editingWeek, formData);
            } else {
                await createWeeklyMod(formData);
            }
            onSuccess();
            onClose();
        } catch (err) {
            // El error ya es manejado por el hook
        }
    };

    const handleClose = useCallback(() => {
        resetError();
        setWeekError(null);
        onClose();
    }, [resetError, onClose]);

    const isFormValid = !weekError && formData.weekNumber > 0 && formData.weekNumber <= 53;

    // Función para obtener el valor de display (vacío si es 0)
    const getDisplayValue = (value: number): string => {
        return value === 0 ? '' : value.toString();
    };

    return (
        <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <DialogPanel className="mx-auto w-full max-w-2xl bg-white rounded-lg shadow-xl max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-between p-4 border-b border-gray-200">
                        <DialogTitle className="text-lg font-semibold text-gray-900">
                            {isEditing ? `Editar semana ${editingWeek}` : 'Registrar datos'}
                        </DialogTitle>
                        <button
                            onClick={handleClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors hover:cursor-pointer"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-4 space-y-4">
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                                <p className="text-red-800 text-sm">{error}</p>
                            </div>
                        )}

                        {!isEditing && existingWeeks.length > 0 && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-blue-800 text-sm">
                                            <strong>Semanas registradas:</strong> {existingWeeks.join(', ')}
                                        </p>
                                        <p className="text-blue-800 text-sm">
                                            <strong>Siguiente disponible:</strong> {nextAvailableWeek}
                                        </p>
                                    </div>
                                    {formData.weekNumber !== nextAvailableWeek && (
                                        <button
                                            type="button"
                                            onClick={handleUseNextWeek}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm font-medium hover:cursor-pointer"
                                        >
                                            Usar semana {nextAvailableWeek}
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-4 gap-4 items-end">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Número de semana *
                                </label>
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    max="53"
                                    value={getDisplayValue(formData.weekNumber)}
                                    onChange={(e) => handleWeekNumberChange(e.target.value)}
                                    disabled={isEditing}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2
                                    focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                                />
                            </div>
                            <div className="col-span-2">
                                {weekError && (
                                    <div className="flex items-center text-red-600">
                                        <svg className="w-4 h-4 text-red-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <p className="text-red-600 text-sm">{weekError}</p>
                                    </div>
                                )}
                                {isEditing && (
                                    <p className="text-sm text-gray-500">
                                        No se puede modificar en edición
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            {/* Sección CU */}
                            <div className="border border-gray-200 rounded-lg p-3">
                                <h3 className="text-sm font-medium text-gray-900 mb-3 text-center">
                                    Cobre (CU)
                                </h3>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                            Meta Productividad *
                                        </label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            required
                                            min="0.1"
                                            value={getDisplayValue(formData.cuData.productivityTarget)}
                                            onChange={(e) => handleInputChange('cuData', 'productivityTarget', e.target.value, true)}
                                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 
                                            focus:ring-blue-500 focus:border-transparent"
                                            placeholder="0.0"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                            Volumen Producción *
                                        </label>
                                        <input
                                            type="number"
                                            required
                                            min="1"
                                            value={getDisplayValue(formData.cuData.productionVolume)}
                                            onChange={(e) => handleInputChange('cuData', 'productionVolume', e.target.value)}
                                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 
                                            focus:ring-blue-500 focus:border-transparent"
                                            placeholder="0"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                            MOD *
                                        </label>
                                        <input
                                            type="number"
                                            required
                                            min="1"
                                            value={getDisplayValue(formData.cuData.mod)}
                                            onChange={(e) => handleInputChange('cuData', 'mod', e.target.value)}
                                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 
                                            focus:ring-blue-500 focus:border-transparent"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Sección AL */}
                            <div className="border border-gray-200 rounded-lg p-3">
                                <h3 className="text-sm font-medium text-gray-900 mb-3 text-center">
                                    Aluminio (AL)
                                </h3>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                            Meta Productividad *
                                        </label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            required
                                            min="0.1"
                                            value={getDisplayValue(formData.alData.productivityTarget)}
                                            onChange={(e) => handleInputChange('alData', 'productivityTarget', e.target.value, true)}
                                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 
                                            focus:ring-blue-500 focus:border-transparent"
                                            placeholder="0.0"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                            Volumen Producción *
                                        </label>
                                        <input
                                            type="number"
                                            required
                                            min="1"
                                            value={getDisplayValue(formData.alData.productionVolume)}
                                            onChange={(e) => handleInputChange('alData', 'productionVolume', e.target.value)}
                                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 
                                            focus:ring-blue-500 focus:border-transparent"
                                            placeholder="0"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                            MOD *
                                        </label>
                                        <input
                                            type="number"
                                            required
                                            min="1"
                                            value={getDisplayValue(formData.alData.mod)}
                                            onChange={(e) => handleInputChange('alData', 'mod', e.target.value)}
                                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 
                                            focus:ring-blue-500 focus:border-transparent"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-2 pt-4 border-t border-gray-200">
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
                                disabled={loading || !isFormValid}
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg 
                                hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50
                                hover:cursor-pointer disabled:cursor-not-allowed"
                            >
                                {loading
                                    ? (isEditing ? 'Actualizando...' : 'Guardando...')
                                    : (isEditing ? 'Actualizar' : 'Guardar')
                                }
                            </button>
                        </div>
                    </form>
                </DialogPanel>
            </div>
        </Dialog>
    );
};