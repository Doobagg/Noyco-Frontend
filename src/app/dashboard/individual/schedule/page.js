"use client";

import { useState } from "react";
import { useSubNav } from "../layout";

// import ManualCallScheduling from "../data/d";
import TrackingComponent from "./components/TrackingComponent";
import ScheduleComponent from "./components/ScheduleComponent";





// Main page component
function SchedulePage() {
    const { activeSubItem } = useSubNav();
    const [showManualSchedule, setShowManualSchedule] = useState(false);

    const handleManualScheduleClose = () => {
        setShowManualSchedule(false);
    };

     
    const renderContent = () => {
        if (activeSubItem === "schedule") {
            if (showManualSchedule) {
                // Show Manual Scheduling UI
                return (
                    <div>
                        {/* Optionally add a close/back button */}
                        <button
                            className="mb-4 px-4 py-2 bg-gray-200 rounded"
                            onClick={handleManualScheduleClose}
                        >
                            Back to Schedule List
                        </button>
                        {/* <ManualCallScheduling /> */}
                    </div>
                );
            }
            // Default ScheduleComponent with "New Schedule" button
            return (
                <div>
 
                    {/* Remove any other "New Schedule" button with calendar SVG here */}
                    <ScheduleComponent />
                </div>
            );
        }
        // ...existing switch logic for other tabs...
        switch (activeSubItem) {
            case "track":
                return <TrackingComponent />;
            default:
                return <TrackingComponent />;
        }
    };

    return (
        <div >
            {/* Breadcrumb */}
            <div className="flex items-center  text-sm text-gray-500">
                <span>Assistant</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                    />
                </svg>
                <span>Schedule</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                    />
                </svg>
                <span className="text-gray-900 font-medium capitalize">{activeSubItem}</span>
            </div>

            {/* Main Content */}
            <div key={activeSubItem}>
                {renderContent()}
            </div>
        </div>
    );
}

export default SchedulePage;

