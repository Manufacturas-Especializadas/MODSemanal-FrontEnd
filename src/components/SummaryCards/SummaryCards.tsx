import type React from "react";

interface SummaryCardsProps {
    totals: {
        productionVolume: number;
        hoursNeed: number;
        mod: number;
        hoursPersonAvailable: number;
        excessPersonHours: number;
    }
};

export const SummaryCards: React.FC<SummaryCardsProps> = ({ totals }) => {

    const cards = [
        {
            title: 'Volumen Total',
            value: totals.productionVolume,
            color: 'blue',
            icon: (
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
            ),
        },
        {
            title: 'Horas Totales',
            value: totals.hoursNeed,
            color: 'green',
            icon: (
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
        },
        {
            title: 'MOD Total',
            value: totals.mod,
            color: 'orange',
            icon: (
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            ),
        },
        {
            title: 'Exceso Horas',
            value: totals.excessPersonHours,
            color: 'red',
            icon: (
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
            ),
        },
    ];

    const colorClasses = {
        blue: 'bg-blue-500',
        green: 'bg-green-500',
        orange: 'bg-orange-500',
        red: 'bg-red-500',
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
            {
                cards.map((card, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center">
                            <div className={`w-8 h-8 ${colorClasses[card.color as keyof typeof colorClasses]} rounded-lg flex items-center justify-center`}>
                                {card.icon}
                            </div>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-600">
                                {card.title}
                            </p>
                            <p className="text-2xl font-semibold text-gray-900">
                                {card.value.toLocaleString()}
                            </p>
                        </div>
                    </div>
                ))
            }
        </div>
    );
};