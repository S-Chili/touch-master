import React from 'react';

const NEO_BLUE = '#00eaff'; 
const NEO_PINK = '#ff00e6'; 
const NEO_PURPLE = '#8a2be2'; 
const NEO_DARK = '#0a0c11'; 

const IconChart = ({ color }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 17 8 12 13 15 19 8" />
        <polyline points="15 8 19 8 19 12" />
    </svg>
);

const StatMetricCard = ({ title, value, unit, color }) => (
    <div
        className={`
            p-6 rounded-xl transition-all duration-300
            bg-black/40 backdrop-blur-sm 
            border border-[${color}]/40
            shadow-[0_0_15px_${color}30]
            hover:shadow-[0_0_25px_${color}50]
        `}
    >
        <div className={`text-sm font-semibold tracking-wider uppercase text-[${color}] mb-1`}>
            {title}
        </div>
        <div className="text-5xl font-extrabold text-white">
            {value}
            <span className="text-xl font-normal ml-2 text-gray-400">{unit}</span>
        </div>
    </div>
);

const ChartPlaceholder = ({ title, color, height = 'h-64' }) => {
    
    let gradientStops = '';
    if (color === NEO_BLUE) {
        gradientStops = 'from-cyan-700/5 to-cyan-400/20';
    } else if (color === NEO_PINK) {
        gradientStops = 'from-pink-700/5 to-pink-400/20';
    } else {
         gradientStops = 'from-purple-700/5 to-purple-400/20';
    }

    return (
        <div className={`
            w-full ${height} p-4 rounded-xl transition-all duration-300
            bg-black/50 backdrop-blur-sm 
            border border-[${color}]/30
            shadow-[0_0_20px_${color}1a]
        `}>
            <h3 className={`text-lg font-semibold text-[${color}] mb-3 flex items-center gap-2`}>
                <IconChart color={color} /> {title}
            </h3>
            
            <div className={`w-full ${height} -mt-4 bg-linear-to-t ${gradientStops} rounded-lg relative`}>
                <div 
                    className={`absolute inset-0 border-t-2 border-dashed border-[${color}]/50`}
                    style={{ clipPath: 'polygon(0% 80%, 20% 65%, 40% 75%, 60% 50%, 80% 60%, 100% 40%, 100% 100%, 0% 100%)' }}
                ></div>
            </div>
        </div>
    );
};


const Stats = () => {
    
    const statsData = {
        wpm: 68,
        accuracy: 97.2,
        best_wpm: 85,
        total_tests: 124,
    };

    return (
        <div className={`relative w-full min-h-screen p-8 text-cyan-300 font-mono bg-[${NEO_DARK}]`}>
            
            <h1 className="text-4xl font-extrabold text-white mb-10 tracking-wider text-center">
                PERFORMANCE ANALYSIS
            </h1>
            
            <section className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                
                <div className="col-span-2">
                    <StatMetricCard 
                        title="Average Speed"
                        value={statsData.wpm}
                        unit="WPM"
                        color={NEO_BLUE}
                    />
                </div>

                <div className="col-span-2">
                    <StatMetricCard 
                        title="Average Accuracy"
                        value={statsData.accuracy}
                        unit="%"
                        color={NEO_PINK}
                    />
                </div>
            </section>

            <section className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
                
                <div className="col-span-2">
                    <ChartPlaceholder 
                        title="WPM Progression Over Time" 
                        color={NEO_BLUE}
                        height="h-96"
                    />
                </div>
                
                <ChartPlaceholder 
                    title="Accuracy Trends" 
                    color={NEO_PINK}
                    height="h-96"
                />
            </section>

            <section className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatMetricCard 
                    title="Best WPM Score"
                    value={statsData.best_wpm}
                    unit="WPM"
                    color={NEO_PURPLE}
                />
                <StatMetricCard 
                    title="Total Tests Completed"
                    value={statsData.total_tests}
                    unit="tests"
                    color={NEO_BLUE}
                />
                 <StatMetricCard 
                    title="Keyboard Layout"
                    value="QWERTY"
                    unit=""
                    color={NEO_PINK}
                />
            </section>

        </div>
    );
};

export default Stats;