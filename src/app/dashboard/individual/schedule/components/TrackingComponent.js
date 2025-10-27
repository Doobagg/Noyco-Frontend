// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   AlertCircle, ArrowDown, ArrowUp, Calendar, Check,
//   CheckCircle, ChevronDown, Filter, ListFilter, MoreHorizontal,
//   Pause, Play, RefreshCw, Search, Trash, X, XCircle, Clock,
//   Phone, User, Settings
// } from "lucide-react";
// import {
//   fetchSchedules,
//   fetchActiveSchedules,
//   fetchScheduleStats,
//   fetchActiveScheduleStats,
//   updateSchedule,
//   deleteSchedule,
//   scheduleAction,
//   setCurrentView,
//   clearError
// } from "../../../../../store/slices/scheduleSlice";

// // Utility functions
// const getStatusColor = (status) => {
//   switch (status?.toLowerCase()) {
//     case 'pending':
//       return 'text-orange-800 border border-orange-300 bg-orange-50';
//     case 'completed':
//       return 'text-green-800 border border-green-300 bg-green-50';
//     case 'failed':
//       return 'text-red-800 border border-red-300 bg-red-50';
//     case 'cancelled':
//       return 'text-gray-800 border border-gray-300 bg-gray-50';
//     case 'active':
//       return 'text-blue-800 border border-blue-300 bg-blue-50';
//     case 'paused':
//       return 'text-yellow-800 border border-yellow-300 bg-yellow-50';
//     default:
//       return 'text-gray-800 border border-gray-300 bg-gray-50';
//   }
// };

// const getStatusIcon = (status) => {
//   switch (status?.toLowerCase()) {
//     case 'pending':
//       return <Clock className="w-4 h-4" />;
//     case 'completed':
//       return <CheckCircle className="w-4 h-4" />;
//     case 'failed':
//       return <XCircle className="w-4 h-4" />;
//     case 'cancelled':
//       return <X className="w-4 h-4" />;
//     case 'active':
//       return <Play className="w-4 h-4" />;
//     case 'paused':
//       return <Pause className="w-4 h-4" />;
//     default:
//       return <AlertCircle className="w-4 h-4" />;
//   }
// };

// const formatFrequency = (frequency) => {
//   switch (frequency?.toLowerCase()) {
//     case 'once':
//       return 'One-time';
//     case 'daily':
//       return 'Daily';
//     case 'weekly':
//       return 'Weekly';
//     case 'monthly':
//       return 'Monthly';
//     case 'custom':
//       return 'Custom';
//     default:
//       return frequency || 'Unknown';
//   }
// };

// const formatCallType = (type) => {
//   switch (type?.toLowerCase()) {
//     case 'followup':
//       return 'Follow-up';
//     case 'reminder':
//       return 'Reminder';
//     case 'check-in':
//     case 'checkin':
//       return 'Check-in';
//     case 'appointment':
//       return 'Appointment';
//     case 'outgoing':
//       return 'Outbound Call';
//     default:
//       return type || 'Call';
//   }
// };

// export default function ScheduleTrackingComponent() {
//   const dispatch = useDispatch();
//   const router = useRouter();
  
//   const {
//     schedules,
//     activeSchedules,
//     scheduleStats,
//     activeScheduleStats,
//     isLoading,
//     isSubmitting,
//     error,
//     currentView
//   } = useSelector(state => state.schedule);

//   const { user } = useSelector(state => state.auth);

//   const [filters, setFilters] = useState({
//     user_profile_id: "",
//     status: "",
//     page: 1,
//     per_page: 10
//   });
//   const [showFilters, setShowFilters] = useState(false);
//   const [selectedSchedule, setSelectedSchedule] = useState(null);
//   const [actionMenu, setActionMenu] = useState({
//     open: false,
//     scheduleId: null,
//     position: { top: 0, left: 0 }
//   });
//   const [confirmAction, setConfirmAction] = useState({
//     open: false,
//     type: null,
//     scheduleId: null
//   });
//   const [updateScheduleModal, setUpdateScheduleModal] = useState({
//     open: false,
//     scheduleId: null,
//     data: {
//       notes: "",
//       scheduled_at: ""
//     },
//     original: null
//   });

//   // Load initial data
//   useEffect(() => {
//     if (user?.role_entity_id) {
//       fetchData();
//     }
//   }, [user?.role_entity_id, currentView]);

//   // Reload data when filters or pagination change
//   useEffect(() => {
//     if (user?.role_entity_id) {
//       if (currentView === 'active') {
//         dispatch(fetchActiveSchedules(filters));
//       } else if (currentView === 'history') {
//         dispatch(fetchCallHistory(filters));
//       } else {
//         dispatch(fetchSchedules(filters));
//       }
//     }
//   }, [filters, currentView, dispatch, user?.role_entity_id]);

//   const fetchData = async () => {
//     try {
//       if (currentView === 'active') {
//         await Promise.all([
//           dispatch(fetchActiveSchedules(filters)),
//           dispatch(fetchActiveScheduleStats(filters))
//         ]);
//       } else {
//         await Promise.all([
//           dispatch(fetchSchedules(filters)),
//           dispatch(fetchScheduleStats(filters))
//         ]);
//       }
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   };

//   const resetFilters = () => {
//     setFilters({
//       user_profile_id: "",
//       status: "",
//       page: 1,
//       per_page: 10
//     });
//   };

//   const handlePageChange = (newPage) => {
//     setFilters(prev => ({ ...prev, page: newPage }));
//   };

//   const handleActionClick = (e, scheduleId) => {
//     e.stopPropagation();
//     const rect = e.currentTarget.getBoundingClientRect();
//     setActionMenu({
//       open: true,
//       scheduleId,
//       position: {
//         top: rect.bottom + window.scrollY,
//         left: rect.left + window.scrollX
//       }
//     });
//   };

//   const closeActionMenu = () => {
//     setActionMenu({
//       open: false,
//       scheduleId: null,
//       position: { top: 0, left: 0 }
//     });
//   };

//   const handleAction = async (action, scheduleId) => {
//     closeActionMenu();
    
//     if (action === 'update') {
//       const schedule = currentView === 'active' 
//         ? activeSchedules.data?.find(s => s.id === scheduleId)
//         : schedules.data?.find(s => s.id === scheduleId);
      
//       if (schedule) {
//         setUpdateScheduleModal({
//           open: true,
//           scheduleId,
//           data: {
//             notes: schedule.notes || "",
//             scheduled_at: currentView === 'active' ? schedule.next_run_time : schedule.schedule_time
//           },
//           original: schedule
//         });
//       }
//       return;
//     }

//     setConfirmAction({
//       open: true,
//       type: action,
//       scheduleId
//     });
//   };

//   const executeConfirmedAction = async () => {
//     try {
//       const { type, scheduleId } = confirmAction;
      
//       switch (type) {
//         case 'pause':
//         case 'resume':
//         case 'cancel':
//           await dispatch(scheduleAction({ 
//             scheduleId, 
//             action: type 
//           })).unwrap();
//           break;
//         case 'delete':
//           await dispatch(deleteSchedule(scheduleId)).unwrap();
//           break;
//       }
      
//       // Refresh data after action
//       fetchData();
      
//     } catch (error) {
//       console.error('Action failed:', error);
//     } finally {
//       setConfirmAction({ open: false, type: null, scheduleId: null });
//     }
//   };

//   const handleUpdateSchedule = async () => {
//     try {
//       const { scheduleId, data } = updateScheduleModal;
      
//       await dispatch(updateSchedule({
//         scheduleId,
//         updateData: {
//           notes: data.notes,
//           schedule_time: data.scheduled_at
//         }
//       })).unwrap();
      
//       setUpdateScheduleModal({
//         open: false,
//         scheduleId: null,
//         data: { notes: "", scheduled_at: "" },
//         original: null
//       });
      
//       // Refresh data
//       fetchData();
      
//     } catch (error) {
//       console.error('Update failed:', error);
//     }
//   };

//   // Get current data based on view
//   const currentData = currentView === 'active' ? activeSchedules : schedules;
//   const currentStats = currentView === 'active' ? activeScheduleStats : scheduleStats;

//   return (
//     <div className="max-w-7xl mx-auto p-6 space-y-6 ">
//       {/* Header */}

// <div
//   className="flex items-center justify-between px-4 py-3 border-b"
//   style={{ borderColor: "var(--border-accent)", backgroundColor: "var(--background)" }}
// >
//   {/* Left side: Title */}
//   <h1
//     className="text-2xl font-bold"
//     style={{ color: "var(--foreground)" }}
//   >
//     Schedule Tracking
//   </h1>

//   {/* Right side: Toggle + Actions */}
//   <div className="flex items-center space-x-3">
//     {/* Toggle */}
//     <div
//       className="flex border"
//       style={{
//         backgroundColor: "var(--beige)",
//         borderColor: "var(--border-accent)",
//       }}
//     >
//       <button
//         onClick={() => dispatch(setCurrentView("schedules"))}
//         className={`px-4 py-2 text-sm font-medium transition-colors border-r`}
//         style={{
//           borderColor: "var(--border-accent)",
//           backgroundColor:
//             currentView === "schedules" ? "var(--primary-100)" : "transparent",
//           color: currentView === "schedules" ? "#000" : "var(--foreground)",
//         }}
//       >
//         Schedules
//       </button>
//       <button
//         onClick={() => dispatch(setCurrentView("active"))}
//         className="px-4 py-2 text-sm font-medium transition-colors"
//         style={{
//           backgroundColor:
//             currentView === "active" ? "var(--primary-100)" : "transparent",
//           color: currentView === "active" ? "#000" : "var(--foreground)",
//         }}
//       >
//         Active
//       </button>
//     </div>

//     {/* Filter Button */}
//     <button
//       onClick={() => setShowFilters(!showFilters)}
//       className="inline-flex items-center px-4 py-2 text-sm font-medium transition-colors"
//       style={{
//         border: "1px solid var(--border-accent)",
//         backgroundColor: "white",
//         color: "var(--foreground)",
//       }}
//     >
//       <Filter className="w-4 h-4 mr-2" />
//       Filters
//     </button>

//     {/* Refresh Button */}
//     <button
//       onClick={fetchData}
//       disabled={isLoading}
//       className="inline-flex items-center px-4 py-2 text-sm font-medium transition-colors"
//       style={{
//         border: "1px solid var(--border-accent)",
//         backgroundColor: "white",
//         color: "var(--foreground)",
//       }}
//     >
//       <RefreshCw
//         className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
//       />
//       Refresh
//     </button>
//   </div>
// </div>


//       {/* <div className="flex items-center justify-between">
//         <div className="flex items-center space-x-4">
//           <h1 className="text-2xl font-bold text-gray-900">Schedule Tracking</h1>
  
//           <div className="bg-gray-100 p-1 rounded-lg flex">
//             <button
//               onClick={() => dispatch(setCurrentView('schedules'))}
//               className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
//                 currentView === 'schedules'
//                   ? 'bg-white text-gray-900 shadow-sm'
//                   : 'text-gray-600 hover:text-gray-900'
//               }`}
//             >
//               Schedules
//             </button>
//             <button
//               onClick={() => dispatch(setCurrentView('active'))}
//               className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
//                 currentView === 'active'
//                   ? 'bg-white text-gray-900 shadow-sm'
//                   : 'text-gray-600 hover:text-gray-900'
//               }`}
//             >
//               Active
//             </button>
//           </div>
//         </div>

//         <div className="flex items-center space-x-2">
//           <button
//             onClick={() => setShowFilters(!showFilters)}
//             className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
//           >
//             <Filter className="w-4 h-4 mr-2" />
//             Filters
//           </button>
//           <button
//             onClick={fetchData}
//             className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
//             disabled={isLoading}
//           >
//             <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
//             Refresh
//           </button>
//         </div>
//       </div> */}

//       {/* Error Display */}
//       {error && (
//         <div 
//           className="border p-4"
//           style={{ 
//             backgroundColor: "#fef2f2", 
//             borderColor: "#fecaca" 
//           }}
//         >
//           <div className="flex">
//             <AlertCircle className="w-5 h-5 text-red-400" />
//             <div className="ml-3">
//               <h3 className="text-sm font-medium text-red-800">Error</h3>
//               <p className="mt-1 text-sm text-red-700">{error}</p>
//             </div>
//             <button
//               onClick={() => dispatch(clearError())}
//               className="ml-auto text-red-400 hover:text-red-600"
//             >
//               <X className="w-4 h-4" />
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Statistics Cards */}
//       {currentStats && (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           {currentView === 'active' ? (
//             // Active Schedule Stats
//             <>
//               <div 
//                 className="p-6 border"
//                 style={{ 
//                   backgroundColor: "var(--beige)", 
//                   borderColor: "var(--border-accent)" 
//                 }}
//               >
//                 <div className="flex items-center">
//                   <div className="flex-shrink-0">
//                     <div 
//                       className="w-8 h-8 flex items-center justify-center"
//                       style={{ 
//                         backgroundColor: "var(--primary-100)", 
//                         color: "var(--foreground)" 
//                       }}
//                     >
//                       <Play className="w-4 h-4" />
//                     </div>
//                   </div>
//                   <div className="ml-4">
//                     <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Active</p>
//                     <p className="text-2xl font-semibold" style={{ color: "var(--foreground)" }}>{currentStats.total_active || 0}</p>
//                   </div>
//                 </div>
//               </div>
//               <div 
//                 className="p-6 border"
//                 style={{ 
//                   backgroundColor: "var(--beige)", 
//                   borderColor: "var(--border-accent)" 
//                 }}
//               >
//                 <div className="flex items-center">
//                   <div className="flex-shrink-0">
//                     <div 
//                       className="w-8 h-8 flex items-center justify-center"
//                       style={{ 
//                         backgroundColor: "#fbbf24", 
//                         color: "var(--foreground)" 
//                       }}
//                     >
//                       <Pause className="w-4 h-4" />
//                     </div>
//                   </div>
//                   <div className="ml-4">
//                     <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Paused</p>
//                     <p className="text-2xl font-semibold" style={{ color: "var(--foreground)" }}>{currentStats.total_paused || 0}</p>
//                   </div>
//                 </div>
//               </div>
//               <div 
//                 className="p-6 border"
//                 style={{ 
//                   backgroundColor: "var(--beige)", 
//                   borderColor: "var(--border-accent)" 
//                 }}
//               >
//                 <div className="flex items-center">
//                   <div className="flex-shrink-0">
//                     <div 
//                       className="w-8 h-8 flex items-center justify-center"
//                       style={{ 
//                         backgroundColor: "#10b981", 
//                         color: "white" 
//                       }}
//                     >
//                       <Calendar className="w-4 h-4" />
//                     </div>
//                   </div>
//                   <div className="ml-4">
//                     <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Upcoming 24h</p>
//                     <p className="text-2xl font-semibold" style={{ color: "var(--foreground)" }}>{currentStats.upcoming_24h || 0}</p>
//                   </div>
//                 </div>
//               </div>
//               <div 
//                 className="p-6 border"
//                 style={{ 
//                   backgroundColor: "var(--beige)", 
//                   borderColor: "var(--border-accent)" 
//                 }}
//               >
//                 <div className="flex items-center">
//                   <div className="flex-shrink-0">
//                     <div 
//                       className="w-8 h-8 flex items-center justify-center"
//                       style={{ 
//                         backgroundColor: "#ef4444", 
//                         color: "white" 
//                       }}
//                     >
//                       <AlertCircle className="w-4 h-4" />
//                     </div>
//                   </div>
//                   <div className="ml-4">
//                     <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Overdue</p>
//                     <p className="text-2xl font-semibold" style={{ color: "var(--foreground)" }}>{currentStats.overdue || 0}</p>
//                   </div>
//                 </div>
//               </div>
//             </>
//           ) : currentView === 'history' ? (
//             // Call History Stats
//             <>
//               <div 
//                 className="p-6 border"
//                 style={{ 
//                   backgroundColor: "var(--beige)", 
//                   borderColor: "var(--border-accent)" 
//                 }}
//               >
//                 <div className="flex items-center">
//                   <div className="flex-shrink-0">
//                     <div 
//                       className="w-8 h-8 flex items-center justify-center"
//                       style={{ 
//                         backgroundColor: "var(--primary-100)", 
//                         color: "var(--foreground)" 
//                       }}
//                     >
//                       <Phone className="w-4 h-4" />
//                     </div>
//                   </div>
//                   <div className="ml-4">
//                     <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Total Calls</p>
//                     <p className="text-2xl font-semibold" style={{ color: "var(--foreground)" }}>{currentStats.total_calls || 0}</p>
//                   </div>
//                 </div>
//               </div>
//               <div 
//                 className="p-6 border"
//                 style={{ 
//                   backgroundColor: "var(--beige)", 
//                   borderColor: "var(--border-accent)" 
//                 }}
//               >
//                 <div className="flex items-center">
//                   <div className="flex-shrink-0">
//                     <div 
//                       className="w-8 h-8 flex items-center justify-center"
//                       style={{ 
//                         backgroundColor: "#10b981", 
//                         color: "white" 
//                       }}
//                     >
//                       <CheckCircle className="w-4 h-4" />
//                     </div>
//                   </div>
//                   <div className="ml-4">
//                     <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Completed</p>
//                     <p className="text-2xl font-semibold" style={{ color: "var(--foreground)" }}>{currentStats.completed_calls || 0}</p>
//                   </div>
//                 </div>
//               </div>
//               <div 
//                 className="p-6 border"
//                 style={{ 
//                   backgroundColor: "var(--beige)", 
//                   borderColor: "var(--border-accent)" 
//                 }}
//               >
//                 <div className="flex items-center">
//                   <div className="flex-shrink-0">
//                     <div 
//                       className="w-8 h-8 flex items-center justify-center"
//                       style={{ 
//                         backgroundColor: "#ef4444", 
//                         color: "white" 
//                       }}
//                     >
//                       <XCircle className="w-4 h-4" />
//                     </div>
//                   </div>
//                   <div className="ml-4">
//                     <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Failed</p>
//                     <p className="text-2xl font-semibold" style={{ color: "var(--foreground)" }}>{currentStats.failed_calls || 0}</p>
//                   </div>
//                 </div>
//               </div>
//               <div 
//                 className="p-6 border"
//                 style={{ 
//                   backgroundColor: "var(--beige)", 
//                   borderColor: "var(--border-accent)" 
//                 }}
//               >
//                 <div className="flex items-center">
//                   <div className="flex-shrink-0">
//                     <div 
//                       className="w-8 h-8 flex items-center justify-center"
//                       style={{ 
//                         backgroundColor: "#8b5cf6", 
//                         color: "white" 
//                       }}
//                     >
//                       <Settings className="w-4 h-4" />
//                     </div>
//                   </div>
//                   <div className="ml-4">
//                     <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Success Rate</p>
//                     <p className="text-2xl font-semibold" style={{ color: "var(--foreground)" }}>
//                       {currentStats.completion_rate ? `${Math.round(currentStats.completion_rate)}%` : '0%'}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </>
//           ) : (
//             // Schedule Stats (original stats for schedules view)
//             <>
//               <div 
//                 className="p-6 border"
//                 style={{ 
//                   backgroundColor: "var(--beige)", 
//                   borderColor: "var(--border-accent)" 
//                 }}
//               >
//                 <div className="flex items-center">
//                   <div className="flex-shrink-0">
//                     <div 
//                       className="w-8 h-8 flex items-center justify-center"
//                       style={{ 
//                         backgroundColor: "#fbbf24", 
//                         color: "var(--foreground)" 
//                       }}
//                     >
//                       <Clock className="w-4 h-4" />
//                     </div>
//                   </div>
//                   <div className="ml-4">
//                     <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Pending</p>
//                     <p className="text-2xl font-semibold" style={{ color: "var(--foreground)" }}>{currentStats.pending || 0}</p>
//                   </div>
//                 </div>
//               </div>
//               <div 
//                 className="p-6 border"
//                 style={{ 
//                   backgroundColor: "var(--beige)", 
//                   borderColor: "var(--border-accent)" 
//                 }}
//               >
//                 <div className="flex items-center">
//                   <div className="flex-shrink-0">
//                     <div 
//                       className="w-8 h-8 flex items-center justify-center"
//                       style={{ 
//                         backgroundColor: "#10b981", 
//                         color: "white" 
//                       }}
//                     >
//                       <CheckCircle className="w-4 h-4" />
//                     </div>
//                   </div>
//                   <div className="ml-4">
//                     <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Completed</p>
//                     <p className="text-2xl font-semibold" style={{ color: "var(--foreground)" }}>{currentStats.completed || 0}</p>
//                   </div>
//                 </div>
//               </div>
//               <div 
//                 className="p-6 border"
//                 style={{ 
//                   backgroundColor: "var(--beige)", 
//                   borderColor: "var(--border-accent)" 
//                 }}
//               >
//                 <div className="flex items-center">
//                   <div className="flex-shrink-0">
//                     <div 
//                       className="w-8 h-8 flex items-center justify-center"
//                       style={{ 
//                         backgroundColor: "#ef4444", 
//                         color: "white" 
//                       }}
//                     >
//                       <XCircle className="w-4 h-4" />
//                     </div>
//                   </div>
//                   <div className="ml-4">
//                     <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Failed</p>
//                     <p className="text-2xl font-semibold" style={{ color: "var(--foreground)" }}>{currentStats.failed || 0}</p>
//                   </div>
//                 </div>
//               </div>
//               <div 
//                 className="p-6 border"
//                 style={{ 
//                   backgroundColor: "var(--beige)", 
//                   borderColor: "var(--border-accent)" 
//                 }}
//               >
//                 <div className="flex items-center">
//                   <div className="flex-shrink-0">
//                     <div 
//                       className="w-8 h-8 flex items-center justify-center"
//                       style={{ 
//                         backgroundColor: "#6b7280", 
//                         color: "white" 
//                       }}
//                     >
//                       <X className="w-4 h-4" />
//                     </div>
//                   </div>
//                   <div className="ml-4">
//                     <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Cancelled</p>
//                     <p className="text-2xl font-semibold" style={{ color: "var(--foreground)" }}>{currentStats.cancelled || 0}</p>
//                   </div>
//                 </div>
//               </div>
//             </>
//           )}
//         </div>
//       )}

//       {/* Filters */}
//       {showFilters && (
//         <div 
//           className="p-4 border"
//           style={{ 
//             backgroundColor: "var(--beige)", 
//             borderColor: "var(--border-accent)" 
//           }}
//         >
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div>
//               <label 
//                 className="block text-sm font-medium mb-1"
//                 style={{ color: "var(--foreground)" }}
//               >
//                 User Profile
//               </label>
//               <input
//                 type="text"
//                 value={filters.user_profile_id}
//                 onChange={(e) => setFilters(prev => ({ ...prev, user_profile_id: e.target.value }))}
//                 className="w-full border px-3 py-2 text-sm"
//                 style={{ 
//                   borderColor: "var(--border-accent)",
//                   backgroundColor: "white",
//                   color: "var(--foreground)"
//                 }}
//                 placeholder="Enter user profile ID"
//               />
//             </div>
//             {(currentView === 'schedules' || currentView === 'history') && (
//               <div>
//                 <label 
//                   className="block text-sm font-medium mb-1"
//                   style={{ color: "var(--foreground)" }}
//                 >
//                   {currentView === 'history' ? 'Call Type' : 'Status'}
//                 </label>
//                 <select
//                   value={currentView === 'history' ? filters.call_type || '' : filters.status}
//                   onChange={(e) => setFilters(prev => ({ 
//                     ...prev, 
//                     [currentView === 'history' ? 'call_type' : 'status']: e.target.value 
//                   }))}
//                   className="w-full border px-3 py-2 text-sm"
//                   style={{ 
//                     borderColor: "var(--border-accent)",
//                     backgroundColor: "white",
//                     color: "var(--foreground)"
//                   }}
//                 >
//                   {currentView === 'history' ? (
//                     <>
//                       <option value="">All Call Types</option>
//                       <option value="incoming">Incoming</option>
//                       <option value="outgoing">Outgoing</option>
//                       <option value="livekit">LiveKit</option>
//                     </>
//                   ) : (
//                     <>
//                       <option value="">All Statuses</option>
//                       <option value="pending">Pending</option>
//                       <option value="completed">Completed</option>
//                       <option value="failed">Failed</option>
//                       <option value="cancelled">Cancelled</option>
//                     </>
//                   )}
//                 </select>
//               </div>
//             )}
//             <div className="flex items-end space-x-2">
//               <button
//                 onClick={resetFilters}
//                 className="px-4 py-2 border text-sm transition-colors"
//                 style={{ 
//                   borderColor: "var(--border-accent)",
//                   backgroundColor: "white",
//                   color: "var(--foreground)"
//                 }}
//               >
//                 Reset Filters
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Data Table */}
//       <div 
//         className="overflow-hidden border"
//         style={{ 
//           backgroundColor: "var(--beige)", 
//           borderColor: "var(--border-accent)" 
//         }}
//       >
//         <div className="overflow-x-auto">
//           <table className="min-w-full">
//             <thead 
//               style={{ 
//                 backgroundColor: "var(--primary-100)",
//                 borderBottomColor: "var(--border-accent)"
//               }}
//               className="border-b"
//             >
//               <tr>
//                 {currentView === 'active' ? (
//                   // Active Schedule Headers
//                   <>
//                     <th 
//                       className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
//                       style={{ color: "var(--foreground)" }}
//                     >
//                       Agent
//                     </th>
//                     <th 
//                       className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
//                       style={{ color: "var(--foreground)" }}
//                     >
//                       User Profile
//                     </th>
//                     <th 
//                       className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
//                       style={{ color: "var(--foreground)" }}
//                     >
//                       Next Run
//                     </th>
//                     <th 
//                       className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
//                       style={{ color: "var(--foreground)" }}
//                     >
//                       Time Until
//                     </th>
//                     <th 
//                       className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
//                       style={{ color: "var(--foreground)" }}
//                     >
//                       Status
//                     </th>
//                     <th 
//                       className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
//                       style={{ color: "var(--foreground)" }}
//                     >
//                       Frequency
//                     </th>
//                     <th 
//                       className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
//                       style={{ color: "var(--foreground)" }}
//                     >
//                       Actions
//                     </th>
//                   </>
//                 ) : currentView === 'history' ? (
//                   // Call History Headers
//                   <>
//                     <th 
//                       className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
//                       style={{ color: "var(--foreground)" }}
//                     >
//                       Phone
//                     </th>
//                     <th 
//                       className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
//                       style={{ color: "var(--foreground)" }}
//                     >
//                       Call Type
//                     </th>
//                     <th 
//                       className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
//                       style={{ color: "var(--foreground)" }}
//                     >
//                       Status
//                     </th>
//                     <th 
//                       className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
//                       style={{ color: "var(--foreground)" }}
//                     >
//                       Start Time
//                     </th>
//                     <th 
//                       className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
//                       style={{ color: "var(--foreground)" }}
//                     >
//                       Duration
//                     </th>
//                     <th 
//                       className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
//                       style={{ color: "var(--foreground)" }}
//                     >
//                       Agent
//                     </th>
//                     <th 
//                       className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
//                       style={{ color: "var(--foreground)" }}
//                     >
//                       Notes
//                     </th>
//                   </>
//                 ) : (
//                   // Schedule Headers
//                   <>
//                     <th 
//                       className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
//                       style={{ color: "var(--foreground)" }}
//                     >
//                       User Profile
//                     </th>
//                     <th 
//                       className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
//                       style={{ color: "var(--foreground)" }}
//                     >
//                       Phone
//                     </th>
//                     <th 
//                       className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
//                       style={{ color: "var(--foreground)" }}
//                     >
//                       Status
//                     </th>
//                     <th 
//                       className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
//                       style={{ color: "var(--foreground)" }}
//                     >
//                       Scheduled At
//                     </th>
//                     <th 
//                       className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
//                       style={{ color: "var(--foreground)" }}
//                     >
//                       Completed At
//                     </th>
//                     <th 
//                       className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
//                       style={{ color: "var(--foreground)" }}
//                     >
//                       Frequency
//                     </th>
//                     <th 
//                       className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
//                       style={{ color: "var(--foreground)" }}
//                     >
//                       Actions
//                     </th>
//                   </>
//                 )}
//               </tr>
//             </thead>
//             <tbody 
//               className="divide-y"
//               style={{ 
//                 backgroundColor: "#f7f6f1",
//                 '--tw-divide-opacity': '1',
//                 borderColor: "var(--border-accent)"
//               }}
//             >
//               {isLoading ? (
//                 <tr>
//                   <td colSpan={7} className="px-6 py-4 text-center">
//                     <div className="flex items-center justify-center">
//                       <RefreshCw className="w-5 h-5 animate-spin text-gray-400 mr-2" />
//                       <span style={{ color: "var(--foreground)" }}>Loading...</span>
//                     </div>
//                   </td>
//                 </tr>
//               ) : currentData?.data?.length > 0 ? (
//                 currentData.data.map((item) => (
//                   <tr key={item.id} className="hover:bg-gray-50">
//                     {currentView === 'active' ? (
//                       // Active Schedule Row
//                       <>
//                         <td 
//                           className="px-6 py-4 whitespace-nowrap text-sm"
//                           style={{ color: "var(--foreground)" }}
//                         >
//                           <div className="flex items-center">
//                             <Settings className="w-4 h-4 text-gray-400 mr-2" />
//                             {item.agent_name || item.agent_instance_id || 'Unknown Agent'}
//                           </div>
//                         </td>
//                         <td 
//                           className="px-6 py-4 whitespace-nowrap text-sm"
//                           style={{ color: "var(--foreground)" }}
//                         >
//                           <div className="flex items-center">
//                             <User className="w-4 h-4 text-gray-400 mr-2" />
//                             {item.user_profile_id}
//                           </div>
//                         </td>
//                         <td 
//                           className="px-6 py-4 whitespace-nowrap text-sm"
//                           style={{ color: "var(--foreground)" }}
//                         >
//                           {new Date(item.next_run_time).toLocaleDateString()} {new Date(item.next_run_time).toLocaleTimeString()}
//                         </td>
//                         <td 
//                           className="px-6 py-4 whitespace-nowrap text-sm"
//                           style={{ color: "var(--foreground)" }}
//                         >
//                           {item.time_until_next || 'N/A'}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium ${getStatusColor(item.is_paused ? 'paused' : 'active')}`}>
//                             {getStatusIcon(item.is_paused ? 'paused' : 'active')}
//                             <span className="ml-1">{item.is_paused ? 'Paused' : 'Active'}</span>
//                           </span>
//                         </td>
//                         <td 
//                           className="px-6 py-4 whitespace-nowrap text-sm"
//                           style={{ color: "var(--foreground)" }}
//                         >
//                           {formatFrequency(item.schedule_details?.repeat_type || 'once')}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                           <div className="relative">
//                             <button
//                               onClick={(e) => handleActionClick(e, item.call_schedule_id || item.id)}
//                               className="text-gray-400 hover:text-gray-600"
//                             >
//                               <MoreHorizontal className="w-4 h-4" />
//                             </button>
//                           </div>
//                         </td>
//                       </>
//                     ) : currentView === 'history' ? (
//                       // Call History Row
//                       <>
//                         <td 
//                           className="px-6 py-4 whitespace-nowrap text-sm"
//                           style={{ color: "var(--foreground)" }}
//                         >
//                           <div className="flex items-center">
//                             <Phone className="w-4 h-4 text-gray-400 mr-2" />
//                             {item.phone}
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                           <div className="flex items-center">
//                             <span className={`inline-flex items-center px-2 py-1 text-xs font-medium border ${
//                               item.call_type === 'incoming' ? 'bg-green-50 text-green-800 border-green-300' :
//                               item.call_type === 'outgoing' ? 'bg-blue-50 text-blue-800 border-blue-300' :
//                               'bg-purple-50 text-purple-800 border-purple-300'
//                             }`}>
//                               {formatCallType(item.call_type)}
//                             </span>
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium ${getStatusColor(item.status)}`}>
//                             {getStatusIcon(item.status)}
//                             <span className="ml-1">{item.status}</span>
//                           </span>
//                         </td>
//                         <td 
//                           className="px-6 py-4 whitespace-nowrap text-sm"
//                           style={{ color: "var(--foreground)" }}
//                         >
//                           {item.start_time ? new Date(item.start_time).toLocaleDateString() + ' ' + new Date(item.start_time).toLocaleTimeString() : 
//                            item.timestamp ? new Date(item.timestamp).toLocaleDateString() + ' ' + new Date(item.timestamp).toLocaleTimeString() : '-'}
//                         </td>
//                         <td 
//                           className="px-6 py-4 whitespace-nowrap text-sm"
//                           style={{ color: "var(--foreground)" }}
//                         >
//                           {item.duration ? `${Math.floor(item.duration / 60)}:${(item.duration % 60).toString().padStart(2, '0')}` : '-'}
//                         </td>
//                         <td 
//                           className="px-6 py-4 whitespace-nowrap text-sm"
//                           style={{ color: "var(--foreground)" }}
//                         >
//                           <div className="flex items-center">
//                             <Settings className="w-4 h-4 text-gray-400 mr-2" />
//                             {item.agent_instance_id || 'N/A'}
//                           </div>
//                         </td>
//                         <td 
//                           className="px-6 py-4 whitespace-nowrap text-sm max-w-xs truncate"
//                           style={{ color: "var(--foreground)" }}
//                         >
//                           {item.notes || '-'}
//                         </td>
//                       </>
//                     ) : (
//                       // Schedule Row
//                       <>
//                         <td 
//                           className="px-6 py-4 whitespace-nowrap text-sm"
//                           style={{ color: "var(--foreground)" }}
//                         >
//                           <div className="flex items-center">
//                             <User className="w-4 h-4 text-gray-400 mr-2" />
//                             {item.user_profile_id}
//                           </div>
//                         </td>
//                         <td 
//                           className="px-6 py-4 whitespace-nowrap text-sm"
//                           style={{ color: "var(--foreground)" }}
//                         >
//                           <div className="flex items-center">
//                             <Phone className="w-4 h-4 text-gray-400 mr-2" />
//                             {item.phone}
//                           </div>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium ${getStatusColor(item.status)}`}>
//                             {getStatusIcon(item.status)}
//                             <span className="ml-1">{item.status}</span>
//                           </span>
//                         </td>
//                         <td 
//                           className="px-6 py-4 whitespace-nowrap text-sm"
//                           style={{ color: "var(--foreground)" }}
//                         >
//                           {new Date(item.schedule_time).toLocaleDateString()} {new Date(item.schedule_time).toLocaleTimeString()}
//                         </td>
//                         <td 
//                           className="px-6 py-4 whitespace-nowrap text-sm"
//                           style={{ color: "var(--foreground)" }}
//                         >
//                           {item.completed_at ? new Date(item.completed_at).toLocaleDateString() + ' ' + new Date(item.completed_at).toLocaleTimeString() : '-'}
//                         </td>
//                         <td 
//                           className="px-6 py-4 whitespace-nowrap text-sm"
//                           style={{ color: "var(--foreground)" }}
//                         >
//                           {formatFrequency(item.repeat_type)}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                           <div className="relative">
//                             <button
//                               onClick={(e) => handleActionClick(e, item.id)}
//                               className="text-gray-400 hover:text-gray-600"
//                             >
//                               <MoreHorizontal className="w-4 h-4" />
//                             </button>
//                           </div>
//                         </td>
//                       </>
//                     )}
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td 
//                     colSpan={7} 
//                     className="px-6 py-4 text-center"
//                     style={{ color: "var(--foreground)" }}
//                   >
//                     No {currentView === 'active' ? 'active schedules' : 
//                         currentView === 'history' ? 'call history' : 'schedules'} found
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination */}
//         {currentData && currentData.total_pages > 1 && (
//           <div 
//             className="px-6 py-3 border-t"
//             style={{ 
//               backgroundColor: "white",
//               borderColor: "var(--border-accent)"
//             }}
//           >
//             <div className="flex items-center justify-between">
//               <div 
//                 className="text-sm"
//                 style={{ color: "var(--foreground)" }}
//               >
//                 Showing {((currentData.page - 1) * currentData.per_page) + 1} to{' '}
//                 {Math.min(currentData.page * currentData.per_page, currentData.total)} of{' '}
//                 {currentData.total} results
//               </div>
//               <div className="flex space-x-2">
//                 <button
//                   onClick={() => handlePageChange(currentData.page - 1)}
//                   disabled={currentData.page <= 1}
//                   className="px-3 py-1 border text-sm disabled:opacity-50 disabled:cursor-not-allowed"
//                   style={{ 
//                     borderColor: "var(--border-accent)",
//                     backgroundColor: "white",
//                     color: "var(--foreground)"
//                   }}
//                 >
//                   Previous
//                 </button>
//                 <span 
//                   className="px-3 py-1 text-sm"
//                   style={{ color: "var(--foreground)" }}
//                 >
//                   Page {currentData.page} of {currentData.total_pages}
//                 </span>
//                 <button
//                   onClick={() => handlePageChange(currentData.page + 1)}
//                   disabled={currentData.page >= currentData.total_pages}
//                   className="px-3 py-1 border text-sm disabled:opacity-50 disabled:cursor-not-allowed"
//                   style={{ 
//                     borderColor: "var(--border-accent)",
//                     backgroundColor: "white",
//                     color: "var(--foreground)"
//                   }}
//                 >
//                   Next
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Action Menu */}
//       {actionMenu.open && (
//         <>
//           <div
//             className="fixed inset-0 z-10"
//             onClick={closeActionMenu}
//           />
//           <div
//             className="absolute z-20 border py-1"
//             style={{
//               backgroundColor: "white",
//               borderColor: "var(--border-accent)",
//               top: actionMenu.position.top,
//               left: actionMenu.position.left
//             }}
//           >
//             {currentView === 'active' ? (
//               // Active Schedule Actions
//               <>
//                 <button
//                   onClick={() => handleAction('pause', actionMenu.scheduleId)}
//                   className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
//                   style={{ color: "var(--foreground)" }}
//                 >
//                   <Pause className="w-4 h-4 mr-2" />
//                   Pause Schedule
//                 </button>
//                 <button
//                   onClick={() => handleAction('resume', actionMenu.scheduleId)}
//                   className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
//                   style={{ color: "var(--foreground)" }}
//                 >
//                   <Play className="w-4 h-4 mr-2" />
//                   Resume Schedule
//                 </button>
//                 <button
//                   onClick={() => handleAction('update', actionMenu.scheduleId)}
//                   className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
//                   style={{ color: "var(--foreground)" }}
//                 >
//                   <Settings className="w-4 h-4 mr-2" />
//                   Edit Schedule
//                 </button>
//                 <button
//                   onClick={() => handleAction('delete', actionMenu.scheduleId)}
//                   className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
//                 >
//                   <Trash className="w-4 h-4 mr-2" />
//                   Delete Schedule
//                 </button>
//               </>
//             ) : currentView === 'history' ? (
//               // Call History Actions (Limited actions)
//               <>
//                 <button
//                   onClick={() => {
//                     closeActionMenu();
//                     const historyItem = currentData?.data?.find(item => item.id === actionMenu.scheduleId);
//                     if (historyItem) {
//                       alert(`Call Details:\nPhone: ${historyItem.phone}\nStatus: ${historyItem.status}\nDuration: ${historyItem.duration ? Math.floor(historyItem.duration / 60) + ':' + (historyItem.duration % 60).toString().padStart(2, '0') : 'N/A'}\nNotes: ${historyItem.notes || 'None'}`);
//                     }
//                   }}
//                   className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
//                   style={{ color: "var(--foreground)" }}
//                 >
//                   <Settings className="w-4 h-4 mr-2" />
//                   View Details
//                 </button>
//               </>
//             ) : (
//               // Schedule Actions - Only Cancel option
//               <>
//                 <button
//                   onClick={() => handleAction('cancel', actionMenu.scheduleId)}
//                   className="flex items-center px-4 py-2 text-sm text-orange-600 hover:bg-orange-50 w-full text-left"
//                 >
//                   <X className="w-4 h-4 mr-2" />
//                   Cancel Schedule
//                 </button>
//               </>
//             )}
//           </div>
//         </>
//       )}

//       {/* Confirmation Modal */}

//       {confirmAction.open && (
//   <div className="fixed inset-0 z-50 overflow-y-auto">
//     {/* Backdrop */}
//     <div className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
//  aria-hidden="true"></div>
    
//     {/* Modal container - centers the modal */}
//     <div className="flex items-center justify-center min-h-screen p-4">
//       {/* Modal content */}
//       <div 
//         className="relative px-4 pt-5 pb-4 text-left overflow-hidden transform transition-all sm:max-w-lg sm:w-full sm:p-6 border"
//         style={{ 
//           backgroundColor: "white",
//           borderColor: "var(--border-accent)"
//         }}
//       >
//         <div>
//           <div 
//             className="mx-auto flex items-center justify-center h-12 w-12 border"
//             style={{ 
//               backgroundColor: "#fef2f2",
//               borderColor: "#fecaca"
//             }}
//           >
//             <AlertCircle className="h-6 w-6 text-red-600" />
//           </div>
//           <div className="mt-3 text-center sm:mt-5">
//             <h3 
//               className="text-lg leading-6 font-medium"
//               style={{ color: "var(--foreground)" }}
//             >
//               Confirm {confirmAction.type?.charAt(0).toUpperCase() + confirmAction.type?.slice(1)}
//             </h3>
//             <div className="mt-2">
//               <p 
//                 className="text-sm"
//                 style={{ color: "var(--foreground)" }}
//               >
//                 Are you sure you want to {confirmAction.type} this schedule? This action cannot be undone.
//               </p>
//             </div>
//           </div>
//         </div>
//         <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
//           <button
//             type="button"
//             onClick={executeConfirmedAction}
//             disabled={isSubmitting}
//             className="w-full inline-flex justify-center border px-4 py-2 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:col-start-2 sm:text-sm disabled:opacity-50"
//             style={{ 
//               backgroundColor: "#dc2626",
//               borderColor: "#dc2626"
//             }}
//           >
//             {isSubmitting ? 'Processing...' : 'Confirm'}
//           </button>
//           <button
//             type="button"
//             onClick={() => setConfirmAction({ open: false, type: null, scheduleId: null })}
//             className="mt-3 w-full inline-flex justify-center border px-4 py-2 text-base font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
//             style={{ 
//               backgroundColor: "white",
//               borderColor: "var(--border-accent)",
//               color: "var(--foreground)"
//             }}
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
//     </div>
//   </div>
// )}
//       {/* {confirmAction.open && (
//         <div className="fixed inset-0 z-50 overflow-y-auto">
//           <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
//             <div className="fixed inset-0 transition-opacity" aria-hidden="true">
//               <div className="absolute inset-0 bg-gray-500 opacity-75">

//                   <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
//               <div>
//                 <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
//                   <AlertCircle className="h-6 w-6 text-red-600" />
//                 </div>
//                 <div className="mt-3 text-center sm:mt-5">
//                   <h3 className="text-lg leading-6 font-medium text-gray-900">
//                     Confirm {confirmAction.type?.charAt(0).toUpperCase() + confirmAction.type?.slice(1)}
//                   </h3>
//                   <div className="mt-2">
//                     <p className="text-sm text-gray-500">
//                       Are you sure you want to {confirmAction.type} this schedule? This action cannot be undone.
//                     </p>
//                   </div>
//                 </div>
//               </div>
//               <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
//                 <button
//                   type="button"
//                   onClick={executeConfirmedAction}
//                   disabled={isSubmitting}
//                   className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:col-start-2 sm:text-sm disabled:opacity-50"
//                 >
//                   {isSubmitting ? 'Processing...' : 'Confirm'}
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => setConfirmAction({ open: false, type: null, scheduleId: null })}
//                   className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//               </div>
//             </div>
          
//           </div>
//         </div>
//       )} */}

//       {/* Update Modal */}
//       {updateScheduleModal.open && (
//         <div className="fixed inset-0 z-50 overflow-y-auto">
//           <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
//             <div className="fixed inset-0 transition-opacity" aria-hidden="true">
//               <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
//             </div>
//             <div 
//               className="inline-block align-bottom px-4 pt-5 pb-4 text-left overflow-hidden transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6 border"
//               style={{ 
//                 backgroundColor: "white",
//                 borderColor: "var(--border-accent)"
//               }}
//             >
//               <div>
//                 <h3 
//                   className="text-lg leading-6 font-medium mb-4"
//                   style={{ color: "var(--foreground)" }}
//                 >
//                   Update Schedule
//                 </h3>
//                 <div className="space-y-4">
//                   <div>
//                     <label 
//                       className="block text-sm font-medium mb-1"
//                       style={{ color: "var(--foreground)" }}
//                     >
//                       Notes
//                     </label>
//                     <textarea
//                       value={updateScheduleModal.data.notes}
//                       onChange={(e) => setUpdateScheduleModal(prev => ({
//                         ...prev,
//                         data: { ...prev.data, notes: e.target.value }
//                       }))}
//                       className="w-full border px-3 py-2 text-sm"
//                       style={{ 
//                         borderColor: "var(--border-accent)",
//                         backgroundColor: "white",
//                         color: "var(--foreground)"
//                       }}
//                       rows={3}
//                       placeholder="Enter notes..."
//                     />
//                   </div>
//                   <div>
//                     <label 
//                       className="block text-sm font-medium mb-1"
//                       style={{ color: "var(--foreground)" }}
//                     >
//                       {currentView === 'active' ? 'Next Run Time' : 'Scheduled Time'}
//                     </label>
//                     <input
//                       type="datetime-local"
//                       value={updateScheduleModal.data.scheduled_at ? new Date(updateScheduleModal.data.scheduled_at).toISOString().slice(0, 16) : ''}
//                       onChange={(e) => setUpdateScheduleModal(prev => ({
//                         ...prev,
//                         data: { ...prev.data, scheduled_at: e.target.value }
//                       }))}
//                       className="w-full border px-3 py-2 text-sm"
//                       style={{ 
//                         borderColor: "var(--border-accent)",
//                         backgroundColor: "white",
//                         color: "var(--foreground)"
//                       }}
//                     />
//                   </div>
//                 </div>
//               </div>
//               <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
//                 <button
//                   type="button"
//                   onClick={handleUpdateSchedule}
//                   disabled={isSubmitting}
//                   className="w-full inline-flex justify-center border px-4 py-2 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm disabled:opacity-50"
//                   style={{ 
//                     backgroundColor: "#2563eb",
//                     borderColor: "#2563eb"
//                   }}
//                 >
//                   {isSubmitting ? 'Updating...' : 'Update'}
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => setUpdateScheduleModal({
//                     open: false,
//                     scheduleId: null,
//                     data: { notes: "", scheduled_at: "" },
//                     original: null
//                   })}
//                   className="mt-3 w-full inline-flex justify-center border px-4 py-2 text-base font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
//                   style={{ 
//                     backgroundColor: "white",
//                     borderColor: "var(--border-accent)",
//                     color: "var(--foreground)"
//                   }}
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }








"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AlertCircle,Calendar, Filter, MoreHorizontal,
  Pause, Play, RefreshCw, Trash, X, XCircle, Clock,
  Phone, User, Settings, Ban,
  CheckCircle
} from "lucide-react";
import {
  fetchSchedules,
  fetchActiveSchedules,
  fetchScheduleStats,
  fetchActiveScheduleStats,
  updateSchedule,
  deleteSchedule,
  scheduleAction,
  setCurrentView,
  clearError
} from "../../../../../store/slices/scheduleSlice";

// Utility functions
const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'pending':
      return 'text-orange-800 border border-orange-300 bg-orange-50';
    case 'completed':
      return 'text-green-800 border border-green-300 bg-green-50';
    case 'failed':
      return 'text-red-800 border border-red-300 bg-red-50';
    case 'cancelled':
      return 'text-gray-800 border border-gray-300 bg-gray-50';
    case 'active':
      return 'text-blue-800 border border-blue-300 bg-blue-50';
    case 'paused':
      return 'text-yellow-800 border border-yellow-300 bg-yellow-50';
    default:
      return 'text-gray-800 border border-gray-300 bg-gray-50';
  }
};

const getStatusIcon = (status) => {
  switch (status?.toLowerCase()) {
    case 'pending':
      return <Clock className="w-4 h-4" />;
    case 'completed':
      return <CheckCircle className="w-4 h-4" />;
    case 'failed':
      return <XCircle className="w-4 h-4" />;
    case 'cancelled':
      return <X className="w-4 h-4" />;
    case 'active':
      return <Play className="w-4 h-4" />;
    case 'paused':
      return <Pause className="w-4 h-4" />;
    default:
      return <AlertCircle className="w-4 h-4" />;
  }
};

const formatFrequency = (frequency) => {
  switch (frequency?.toLowerCase()) {
    case 'once':
      return 'One-time';
    case 'daily':
      return 'Daily';
    case 'weekly':
      return 'Weekly';
    case 'monthly':
      return 'Monthly';
    case 'custom':
      return 'Custom';
    default:
      return frequency || 'Unknown';
  }
};

const formatCallType = (type) => {
  switch (type?.toLowerCase()) {
    case 'followup':
      return 'Follow-up';
    case 'reminder':
      return 'Reminder';
    case 'check-in':
    case 'checkin':
      return 'Check-in';
    case 'appointment':
      return 'Appointment';
    case 'outgoing':
      return 'Outbound Call';
    default:
      return type || 'Call';
  }
};

export default function ScheduleTrackingComponent() {
  const dispatch = useDispatch();
  
  const {
    schedules,
    activeSchedules,
    scheduleStats,
    activeScheduleStats,
    isLoading,
    isSubmitting,
    error,
    currentView
  } = useSelector(state => state.schedule);

  const { user } = useSelector(state => state.auth);

  const [filters, setFilters] = useState({
    user_profile_id: "",
    status: "",
    page: 1,
    per_page: 10
  });
  const [showFilters, setShowFilters] = useState(false);
  const [actionMenu, setActionMenu] = useState({
    open: false,
    scheduleId: null,
    position: { top: 0, left: 0 }
  });
  const [confirmAction, setConfirmAction] = useState({
    open: false,
    type: null,
    scheduleId: null
  });
  const [updateScheduleModal, setUpdateScheduleModal] = useState({
    open: false,
    scheduleId: null,
    data: {
      notes: "",
      scheduled_at: ""
    },
    original: null
  });

  // Load initial data
  useEffect(() => {
    if (user?.role_entity_id) {
      fetchData();
    }
  }, [user?.role_entity_id, currentView]);

  // Reload data when filters or pagination change
  useEffect(() => {
    if (user?.role_entity_id) {
      if (currentView === 'active') {
        dispatch(fetchActiveSchedules(filters));
      } else if (currentView === 'history') {
        dispatch(fetchCallHistory(filters));
      } else {
        dispatch(fetchSchedules(filters));
      }
    }
  }, [filters, currentView, dispatch, user?.role_entity_id]);

  const fetchData = async () => {
    try {
      if (currentView === 'active') {
        await Promise.all([
          dispatch(fetchActiveSchedules(filters)),
          dispatch(fetchActiveScheduleStats(filters))
        ]);
      } else {
        await Promise.all([
          dispatch(fetchSchedules(filters)),
          dispatch(fetchScheduleStats(filters))
        ]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const resetFilters = () => {
    setFilters({
      user_profile_id: "",
      status: "",
      page: 1,
      per_page: 10
    });
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const handleActionClick = (e, scheduleId) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    setActionMenu({
      open: true,
      scheduleId,
      position: {
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX
      }
    });
  };

  const closeActionMenu = () => {
    setActionMenu({
      open: false,
      scheduleId: null,
      position: { top: 0, left: 0 }
    });
  };

  const handleAction = async (action, scheduleId) => {
    closeActionMenu();
    
    if (action === 'update') {
      const schedule = currentView === 'active' 
        ? activeSchedules.data?.find(s => s.id === scheduleId)
        : schedules.data?.find(s => s.id === scheduleId);
      
      if (schedule) {
        setUpdateScheduleModal({
          open: true,
          scheduleId,
          data: {
            notes: schedule.notes || "",
            scheduled_at: currentView === 'active' ? schedule.next_run_time : schedule.schedule_time
          },
          original: schedule
        });
      }
      return;
    }

    setConfirmAction({
      open: true,
      type: action,
      scheduleId
    });
  };

  const executeConfirmedAction = async () => {
    try {
      const { type, scheduleId } = confirmAction;
      
      switch (type) {
        case 'pause':
        case 'resume':
        case 'cancel':
          await dispatch(scheduleAction({ 
            scheduleId, 
            action: type 
          })).unwrap();
          break;
        case 'delete':
          await dispatch(deleteSchedule(scheduleId)).unwrap();
          break;
      }
      
      // Refresh data after action
      fetchData();
      
    } catch (error) {
      console.error('Action failed:', error);
    } finally {
      setConfirmAction({ open: false, type: null, scheduleId: null });
    }
  };

  const handleUpdateSchedule = async () => {
    try {
      const { scheduleId, data } = updateScheduleModal;
      
      await dispatch(updateSchedule({
        scheduleId,
        updateData: {
          notes: data.notes,
          schedule_time: data.scheduled_at
        }
      })).unwrap();
      
      setUpdateScheduleModal({
        open: false,
        scheduleId: null,
        data: { notes: "", scheduled_at: "" },
        original: null
      });
      
      // Refresh data
      fetchData();
      
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  // Get current data based on view
  const currentData = currentView === 'active' ? activeSchedules : schedules;
  const currentStats = currentView === 'active' ? activeScheduleStats : scheduleStats;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6 bg-beige">
      {/* Header */}

<div
  className="flex items-center justify-between px-4 py-3 border border-accent bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC]"
>
  {/* Left side: Title */}
  <h1
    className="text-2xl font-bold"
    style={{ color: "var(--foreground)" }}
  >
    Schedule Tracking
  </h1>

  {/* Right side: Toggle + Actions */}
  <div className="flex items-center space-x-3">
    {/* Toggle */}
    <div
      className="flex border"
      style={{
        backgroundColor: "var(--beige)",
        borderColor: "var(--border-accent)",
      }}
    >
      <button
        onClick={() => dispatch(setCurrentView("schedules"))}
        className={`px-4 py-2 text-sm font-medium transition-colors border-r ${
          currentView === "schedules" ? "bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC]" : ""
        }`}
        style={{
          borderColor: "var(--border-accent)",
          color: currentView === "schedules" ? "var(--foreground)" : "var(--foreground)",
        }}
      >
        Schedules
      </button>
      <button
        onClick={() => dispatch(setCurrentView("active"))}
        className={`px-4 py-2 text-sm font-medium transition-colors ${
          currentView === "active" ? "bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC]" : ""
        }`}
        style={{
          color: currentView === "active" ? "var(--foreground)" : "var(--foreground)",
        }}
      >
        Active
      </button>
    </div>

    {/* Filter Button */}
    <button
      onClick={() => setShowFilters(!showFilters)}
      className="inline-flex items-center px-4 py-2 text-sm font-medium transition-colors"
      style={{
        border: "1px solid var(--border-accent)",
        backgroundColor: "white",
        color: "var(--foreground)",
      }}
    >
      <Filter className="w-4 h-4 mr-2" />
      Filters
    </button>

    {/* Refresh Button */}
    <button
      onClick={fetchData}
      disabled={isLoading}
      className="inline-flex items-center px-4 py-2 text-sm font-medium transition-colors"
      style={{
        border: "1px solid var(--border-accent)",
        backgroundColor: "white",
        color: "var(--foreground)",
      }}
    >
      <RefreshCw
        className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
      />
      Refresh
    </button>
  </div>
</div>


      {/* <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-900">Schedule Tracking</h1>
  
          <div className="bg-gray-100 p-1 rounded-lg flex">
            <button
              onClick={() => dispatch(setCurrentView('schedules'))}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                currentView === 'schedules'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Schedules
            </button>
            <button
              onClick={() => dispatch(setCurrentView('active'))}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                currentView === 'active'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Active
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </button>
          <button
            onClick={fetchData}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div> */}

      {/* Error Display */}
      {error && (
        <div 
          className="border p-4"
          style={{ 
            backgroundColor: "#fef2f2", 
            borderColor: "#fecaca" 
          }}
        >
          <div className="flex">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>
            <button
              onClick={() => dispatch(clearError())}
              className="ml-auto text-red-400 hover:text-red-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Statistics Cards */}
      {currentStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {currentView === 'active' ? (
            // Active Schedule Stats
            <>
              <div 
                className="p-6 border"
                style={{ 
                  backgroundColor: "var(--beige)", 
                  borderColor: "var(--border-accent)" 
                }}
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div 
                      className="w-8 h-8 flex items-center justify-center"
                      style={{ 
                        backgroundColor: "var(--primary-100)", 
                        color: "var(--foreground)" 
                      }}
                    >
                      <Play className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Active</p>
                    <p className="text-2xl font-semibold" style={{ color: "var(--foreground)" }}>{currentStats.total_active || 0}</p>
                  </div>
                </div>
              </div>
              <div 
                className="p-6 border"
                style={{ 
                  backgroundColor: "var(--beige)", 
                  borderColor: "var(--border-accent)" 
                }}
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div 
                      className="w-8 h-8 flex items-center justify-center"
                      style={{ 
                        backgroundColor: "#fbbf24", 
                        color: "var(--foreground)" 
                      }}
                    >
                      <Pause className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Paused</p>
                    <p className="text-2xl font-semibold" style={{ color: "var(--foreground)" }}>{currentStats.total_paused || 0}</p>
                  </div>
                </div>
              </div>
              <div 
                className="p-6 border"
                style={{ 
                  backgroundColor: "var(--beige)", 
                  borderColor: "var(--border-accent)" 
                }}
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div 
                      className="w-8 h-8 flex items-center justify-center"
                      style={{ 
                        backgroundColor: "#10b981", 
                        color: "white" 
                      }}
                    >
                      <Calendar className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Upcoming 24h</p>
                    <p className="text-2xl font-semibold" style={{ color: "var(--foreground)" }}>{currentStats.upcoming_24h || 0}</p>
                  </div>
                </div>
              </div>
              <div 
                className="p-6 border"
                style={{ 
                  backgroundColor: "var(--beige)", 
                  borderColor: "var(--border-accent)" 
                }}
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div 
                      className="w-8 h-8 flex items-center justify-center"
                      style={{ 
                        backgroundColor: "#ef4444", 
                        color: "white" 
                      }}
                    >
                      <AlertCircle className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Overdue</p>
                    <p className="text-2xl font-semibold" style={{ color: "var(--foreground)" }}>{currentStats.overdue || 0}</p>
                  </div>
                </div>
              </div>
            </>
          ) : currentView === 'history' ? (
            // Call History Stats
            <>
              <div 
                className="p-6 border"
                style={{ 
                  backgroundColor: "var(--beige)", 
                  borderColor: "var(--border-accent)" 
                }}
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div 
                      className="w-8 h-8 flex items-center justify-center"
                      style={{ 
                        backgroundColor: "var(--primary-100)", 
                        color: "var(--foreground)" 
                      }}
                    >
                      <Phone className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Total Calls</p>
                    <p className="text-2xl font-semibold" style={{ color: "var(--foreground)" }}>{currentStats.total_calls || 0}</p>
                  </div>
                </div>
              </div>
              <div 
                className="p-6 border"
                style={{ 
                  backgroundColor: "var(--beige)", 
                  borderColor: "var(--border-accent)" 
                }}
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div 
                      className="w-8 h-8 flex items-center justify-center"
                      style={{ 
                        backgroundColor: "#10b981", 
                        color: "white" 
                      }}
                    >
                      <CheckCircle className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Completed</p>
                    <p className="text-2xl font-semibold" style={{ color: "var(--foreground)" }}>{currentStats.completed_calls || 0}</p>
                  </div>
                </div>
              </div>
              <div 
                className="p-6 border"
                style={{ 
                  backgroundColor: "var(--beige)", 
                  borderColor: "var(--border-accent)" 
                }}
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div 
                      className="w-8 h-8 flex items-center justify-center"
                      style={{ 
                        backgroundColor: "#ef4444", 
                        color: "white" 
                      }}
                    >
                      <XCircle className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Failed</p>
                    <p className="text-2xl font-semibold" style={{ color: "var(--foreground)" }}>{currentStats.failed_calls || 0}</p>
                  </div>
                </div>
              </div>
              <div 
                className="p-6 border"
                style={{ 
                  backgroundColor: "var(--beige)", 
                  borderColor: "var(--border-accent)" 
                }}
              >
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div 
                      className="w-8 h-8 flex items-center justify-center"
                      style={{ 
                        backgroundColor: "#8b5cf6", 
                        color: "white" 
                      }}
                    >
                      <Settings className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Success Rate</p>
                    <p className="text-2xl font-semibold" style={{ color: "var(--foreground)" }}>
                      {currentStats.completion_rate ? `${Math.round(currentStats.completion_rate)}%` : '0%'}
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            // Schedule Stats (original stats for schedules view)
            <>
              <div 
                className="p-6 border"
                style={{ 
                  backgroundColor: "var(--beige)", 
                  borderColor: "var(--border-accent)" 
                }}
              >
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-gray-700" />
                  <div className="ml-3">
                    <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Pending</p>
                    <p className="text-2xl font-semibold" style={{ color: "var(--foreground)" }}>{currentStats.pending || 0}</p>
                  </div>
                </div>
              </div>
              <div 
                className="p-6 border"
                style={{ 
                  backgroundColor: "var(--beige)", 
                  borderColor: "var(--border-accent)" 
                }}
              >
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-gray-700" />
                  <div className="ml-3">
                    <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Completed</p>
                    <p className="text-2xl font-semibold" style={{ color: "var(--foreground)" }}>{currentStats.completed || 0}</p>
                  </div>
                </div>
              </div>
              <div 
                className="p-6 border"
                style={{ 
                  backgroundColor: "var(--beige)", 
                  borderColor: "var(--border-accent)" 
                }}
              >
                <div className="flex items-center">
                  <XCircle className="w-5 h-5 text-gray-700" />
                  <div className="ml-3">
                    <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Failed</p>
                    <p className="text-2xl font-semibold" style={{ color: "var(--foreground)" }}>{currentStats.failed || 0}</p>
                  </div>
                </div>
              </div>
              <div 
                className="p-6 border"
                style={{ 
                  backgroundColor: "var(--beige)", 
                  borderColor: "var(--border-accent)" 
                }}
              >
                <div className="flex items-center">
                  <Ban className="w-5 h-5 text-gray-700" />
                  <div className="ml-3">
                    <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>Cancelled</p>
                    <p className="text-2xl font-semibold" style={{ color: "var(--foreground)" }}>{currentStats.cancelled || 0}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Filters */}
      {showFilters && (
        <div 
          className="p-4 border"
          style={{ 
            backgroundColor: "var(--beige)", 
            borderColor: "var(--border-accent)" 
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label 
                className="block text-sm font-medium mb-1"
                style={{ color: "var(--foreground)" }}
              >
                User Profile
              </label>
              <input
                type="text"
                value={filters.user_profile_id}
                onChange={(e) => setFilters(prev => ({ ...prev, user_profile_id: e.target.value }))}
                className="w-full border px-3 py-2 text-sm"
                style={{ 
                  borderColor: "var(--border-accent)",
                  backgroundColor: "white",
                  color: "var(--foreground)"
                }}
                placeholder="Enter user profile ID"
              />
            </div>
            {(currentView === 'schedules' || currentView === 'history') && (
              <div>
                <label 
                  className="block text-sm font-medium mb-1"
                  style={{ color: "var(--foreground)" }}
                >
                  {currentView === 'history' ? 'Call Type' : 'Status'}
                </label>
                <select
                  value={currentView === 'history' ? filters.call_type || '' : filters.status}
                  onChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    [currentView === 'history' ? 'call_type' : 'status']: e.target.value 
                  }))}
                  className="w-full border px-3 py-2 text-sm"
                  style={{ 
                    borderColor: "var(--border-accent)",
                    backgroundColor: "white",
                    color: "var(--foreground)"
                  }}
                >
                  {currentView === 'history' ? (
                    <>
                      <option value="">All Call Types</option>
                      <option value="incoming">Incoming</option>
                      <option value="outgoing">Outgoing</option>
                      <option value="livekit">LiveKit</option>
                    </>
                  ) : (
                    <>
                      <option value="">All Statuses</option>
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                      <option value="failed">Failed</option>
                      <option value="cancelled">Cancelled</option>
                    </>
                  )}
                </select>
              </div>
            )}
            <div className="flex items-end space-x-2">
              <button
                onClick={resetFilters}
                className="px-4 py-2 border text-sm transition-colors"
                style={{ 
                  borderColor: "var(--border-accent)",
                  backgroundColor: "white",
                  color: "var(--foreground)"
                }}
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Data Table */}
      <div 
        className="overflow-hidden border border-accent bg-beige"
      >
        <div className="w-full">
          <table className="w-full table-auto">
            <thead 
              className="border-b bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC]"
              style={{ 
                borderBottomColor: "var(--border-accent)"
              }}
            >
              <tr>
                {currentView === 'active' ? (
                  // Active Schedule Headers
                  <>
                    <th 
                      className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider w-1/6"
                      style={{ color: "var(--foreground)" }}
                    >
                      Agent
                    </th>
                    <th 
                      className="px-2 py-3 text-left text-xs font-medium uppercase tracking-wider w-1/6 hidden md:table-cell"
                      style={{ color: "var(--foreground)" }}
                    >
                      Profile
                    </th>
                    <th 
                      className="px-2 py-3 text-left text-xs font-medium uppercase tracking-wider w-1/6"
                      style={{ color: "var(--foreground)" }}
                    >
                      Next Run
                    </th>
                    <th 
                      className="px-2 py-3 text-left text-xs font-medium uppercase tracking-wider w-1/6 hidden lg:table-cell"
                      style={{ color: "var(--foreground)" }}
                    >
                      Time Until
                    </th>
                    <th 
                      className="px-2 py-3 text-left text-xs font-medium uppercase tracking-wider w-1/6"
                      style={{ color: "var(--foreground)" }}
                    >
                      Status
                    </th>
                    <th 
                      className="px-2 py-3 text-left text-xs font-medium uppercase tracking-wider w-1/6 hidden sm:table-cell"
                      style={{ color: "var(--foreground)" }}
                    >
                      Frequency
                    </th>
                    <th 
                      className="px-2 py-3 text-left text-xs font-medium uppercase tracking-wider w-1/6"
                      style={{ color: "var(--foreground)" }}
                    >
                      Actions
                    </th>
                  </>
                ) : currentView === 'history' ? (
                  // Call History Headers
                  <>
                    <th 
                      className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider w-1/5"
                      style={{ color: "var(--foreground)" }}
                    >
                      Phone
                    </th>
                    <th 
                      className="px-2 py-3 text-left text-xs font-medium uppercase tracking-wider w-1/5 hidden sm:table-cell"
                      style={{ color: "var(--foreground)" }}
                    >
                      Call Type
                    </th>
                    <th 
                      className="px-2 py-3 text-left text-xs font-medium uppercase tracking-wider w-1/5"
                      style={{ color: "var(--foreground)" }}
                    >
                      Status
                    </th>
                    <th 
                      className="px-2 py-3 text-left text-xs font-medium uppercase tracking-wider w-1/5"
                      style={{ color: "var(--foreground)" }}
                    >
                      Start Time
                    </th>
                    <th 
                      className="px-2 py-3 text-left text-xs font-medium uppercase tracking-wider w-1/5 hidden md:table-cell"
                      style={{ color: "var(--foreground)" }}
                    >
                      Duration
                    </th>
                    <th 
                      className="px-2 py-3 text-left text-xs font-medium uppercase tracking-wider w-1/5 hidden lg:table-cell"
                      style={{ color: "var(--foreground)" }}
                    >
                      Agent
                    </th>
                    <th 
                      className="px-2 py-3 text-left text-xs font-medium uppercase tracking-wider w-1/5 hidden xl:table-cell"
                      style={{ color: "var(--foreground)" }}
                    >
                      Notes
                    </th>
                  </>
                ) : (
                  // Schedule Headers
                  <>
                    <th 
                      className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider w-1/6"
                      style={{ color: "var(--foreground)" }}
                    >
                      Profile
                    </th>
                    <th 
                      className="px-2 py-3 text-left text-xs font-medium uppercase tracking-wider w-1/6 hidden md:table-cell"
                      style={{ color: "var(--foreground)" }}
                    >
                      Phone
                    </th>
                    <th 
                      className="px-2 py-3 text-left text-xs font-medium uppercase tracking-wider w-1/6"
                      style={{ color: "var(--foreground)" }}
                    >
                      Status
                    </th>
                    <th 
                      className="px-2 py-3 text-left text-xs font-medium uppercase tracking-wider w-1/6"
                      style={{ color: "var(--foreground)" }}
                    >
                      Scheduled
                    </th>
                    <th 
                      className="px-2 py-3 text-left text-xs font-medium uppercase tracking-wider w-1/6 hidden lg:table-cell"
                      style={{ color: "var(--foreground)" }}
                    >
                      Completed
                    </th>
                    <th 
                      className="px-2 py-3 text-left text-xs font-medium uppercase tracking-wider w-1/6 hidden sm:table-cell"
                      style={{ color: "var(--foreground)" }}
                    >
                      Frequency
                    </th>
                    <th 
                      className="px-2 py-3 text-left text-xs font-medium uppercase tracking-wider w-1/6"
                      style={{ color: "var(--foreground)" }}
                    >
                      Actions
                    </th>
                  </>
                )}
              </tr>
            </thead>
            <tbody 
              className="divide-y"
              style={{ 
                backgroundColor: "#f7f6f1",
                '--tw-divide-opacity': '1',
                borderColor: "var(--border-accent)"
              }}
            >
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center">
                      <RefreshCw className="w-5 h-5 animate-spin text-gray-400 mr-2" />
                      <span style={{ color: "var(--foreground)" }}>Loading...</span>
                    </div>
                  </td>
                </tr>
              ) : currentData?.data?.length > 0 ? (
                currentData.data.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    {currentView === 'active' ? (
                      // Active Schedule Row
                      <>
                        <td 
                          className="px-3 py-4 text-sm"
                          style={{ color: "var(--foreground)" }}
                        >
                          <div className="flex items-center">
                            <Settings className="w-4 h-4 text-gray-400 mr-1 flex-shrink-0" />
                            <span className="truncate">{item.agent_name || item.agent_instance_id || 'Unknown Agent'}</span>
                          </div>
                        </td>
                        <td 
                          className="px-2 py-4 text-sm hidden md:table-cell"
                          style={{ color: "var(--foreground)" }}
                        >
                          <div className="flex items-center">
                            <User className="w-4 h-4 text-gray-400 mr-1 flex-shrink-0" />
                            <span className="truncate">{item.user_profile_id}</span>
                          </div>
                        </td>
                        <td 
                          className="px-2 py-4 text-xs"
                          style={{ color: "var(--foreground)" }}
                        >
                          <div className="flex flex-col">
                            <span>{new Date(item.next_run_time).toLocaleDateString()}</span>
                            <span className="text-xs text-gray-500">{new Date(item.next_run_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                          </div>
                        </td>
                        <td 
                          className="px-2 py-4 text-sm hidden lg:table-cell"
                          style={{ color: "var(--foreground)" }}
                        >
                          {item.time_until_next || 'N/A'}
                        </td>
                        <td className="px-2 py-4">
                          <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium ${getStatusColor(item.is_paused ? 'paused' : 'active')}`}>
                            {getStatusIcon(item.is_paused ? 'paused' : 'active')}
                            <span className="ml-1 hidden sm:inline">{item.is_paused ? 'Paused' : 'Active'}</span>
                          </span>
                        </td>
                        <td 
                          className="px-2 py-4 text-sm hidden sm:table-cell"
                          style={{ color: "var(--foreground)" }}
                        >
                          {formatFrequency(item.schedule_details?.repeat_type || 'once')}
                        </td>
                        <td className="px-2 py-4 text-sm font-medium">
                          <div className="relative">
                            <button
                              onClick={(e) => handleActionClick(e, item.call_schedule_id || item.id)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </>
                    ) : currentView === 'history' ? (
                      // Call History Row
                      <>
                        <td 
                          className="px-3 py-4 text-sm"
                          style={{ color: "var(--foreground)" }}
                        >
                          <div className="flex items-center">
                            <Phone className="w-4 h-4 text-gray-400 mr-1 flex-shrink-0" />
                            <span className="truncate">{item.phone}</span>
                          </div>
                        </td>
                        <td className="px-2 py-4 text-sm text-gray-900 hidden sm:table-cell">
                          <span className={`inline-flex items-center px-2 py-1 text-xs font-medium border ${
                            item.call_type === 'incoming' ? 'bg-green-50 text-green-800 border-green-300' :
                            item.call_type === 'outgoing' ? 'bg-blue-50 text-blue-800 border-blue-300' :
                            'bg-purple-50 text-purple-800 border-purple-300'
                          }`}>
                            {formatCallType(item.call_type)}
                          </span>
                        </td>
                        <td className="px-2 py-4">
                          <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium ${getStatusColor(item.status)}`}>
                            {getStatusIcon(item.status)}
                            <span className="ml-1 hidden sm:inline">{item.status}</span>
                          </span>
                        </td>
                        <td 
                          className="px-2 py-4 text-xs"
                          style={{ color: "var(--foreground)" }}
                        >
                          <div className="flex flex-col">
                            <span>{item.start_time ? new Date(item.start_time).toLocaleDateString() : 
                                   item.timestamp ? new Date(item.timestamp).toLocaleDateString() : '-'}</span>
                            <span className="text-xs text-gray-500">
                              {item.start_time ? new Date(item.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 
                               item.timestamp ? new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
                            </span>
                          </div>
                        </td>
                        <td 
                          className="px-2 py-4 text-sm hidden md:table-cell"
                          style={{ color: "var(--foreground)" }}
                        >
                          {item.duration ? `${Math.floor(item.duration / 60)}:${(item.duration % 60).toString().padStart(2, '0')}` : '-'}
                        </td>
                        <td 
                          className="px-2 py-4 text-sm hidden lg:table-cell"
                          style={{ color: "var(--foreground)" }}
                        >
                          <div className="flex items-center">
                            <Settings className="w-4 h-4 text-gray-400 mr-1 flex-shrink-0" />
                            <span className="truncate">{item.agent_instance_id || 'N/A'}</span>
                          </div>
                        </td>
                        <td 
                          className="px-2 py-4 text-sm max-w-xs truncate hidden xl:table-cell"
                          style={{ color: "var(--foreground)" }}
                        >
                          {item.notes || '-'}
                        </td>
                      </>
                    ) : (
                      // Schedule Row
                      <>
                        <td 
                          className="px-3 py-4 text-sm"
                          style={{ color: "var(--foreground)" }}
                        >
                          <div className="flex items-center">
                            <User className="w-4 h-4 text-gray-400 mr-1 flex-shrink-0" />
                            <span className="truncate">{item.user_profile_id}</span>
                          </div>
                        </td>
                        <td 
                          className="px-2 py-4 text-sm hidden md:table-cell"
                          style={{ color: "var(--foreground)" }}
                        >
                          <div className="flex items-center">
                            <Phone className="w-4 h-4 text-gray-400 mr-1 flex-shrink-0" />
                            <span className="truncate">{item.phone}</span>
                          </div>
                        </td>
                        <td className="px-2 py-4">
                          <span className={`inline-flex items-center px-2 py-0.5 text-xs font-medium ${getStatusColor(item.status)}`}>
                            {getStatusIcon(item.status)}
                            <span className="ml-1 hidden sm:inline">{item.status}</span>
                          </span>
                        </td>
                        <td 
                          className="px-2 py-4 text-xs"
                          style={{ color: "var(--foreground)" }}
                        >
                          <div className="flex flex-col">
                            <span>{new Date(item.schedule_time).toLocaleDateString()}</span>
                            <span className="text-xs text-gray-500">{new Date(item.schedule_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                          </div>
                        </td>
                        <td 
                          className="px-2 py-4 text-xs hidden lg:table-cell"
                          style={{ color: "var(--foreground)" }}
                        >
                          <div className="flex flex-col">
                            {item.completed_at ? (
                              <>
                                <span>{new Date(item.completed_at).toLocaleDateString()}</span>
                                <span className="text-xs text-gray-500">{new Date(item.completed_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                              </>
                            ) : (
                              <span>-</span>
                            )}
                          </div>
                        </td>
                        <td 
                          className="px-2 py-4 text-sm hidden sm:table-cell"
                          style={{ color: "var(--foreground)" }}
                        >
                          {formatFrequency(item.repeat_type)}
                        </td>
                        <td className="px-2 py-4 text-sm font-medium">
                          <div className="relative">
                            <button
                              onClick={(e) => handleActionClick(e, item.id)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td 
                    colSpan={7} 
                    className="px-6 py-4 text-center"
                    style={{ color: "var(--foreground)" }}
                  >
                    No {currentView === 'active' ? 'active schedules' : 
                        currentView === 'history' ? 'call history' : 'schedules'} found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {currentData && currentData.total_pages > 1 && (
          <div 
            className="px-6 py-3 border-t"
            style={{ 
              backgroundColor: "white",
              borderColor: "var(--border-accent)"
            }}
          >
            <div className="flex items-center justify-between">
              <div 
                className="text-sm"
                style={{ color: "var(--foreground)" }}
              >
                Showing {((currentData.page - 1) * currentData.per_page) + 1} to{' '}
                {Math.min(currentData.page * currentData.per_page, currentData.total)} of{' '}
                {currentData.total} results
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handlePageChange(currentData.page - 1)}
                  disabled={currentData.page <= 1}
                  className="px-3 py-1 border text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ 
                    borderColor: "var(--border-accent)",
                    backgroundColor: "white",
                    color: "var(--foreground)"
                  }}
                >
                  Previous
                </button>
                <span 
                  className="px-3 py-1 text-sm"
                  style={{ color: "var(--foreground)" }}
                >
                  Page {currentData.page} of {currentData.total_pages}
                </span>
                <button
                  onClick={() => handlePageChange(currentData.page + 1)}
                  disabled={currentData.page >= currentData.total_pages}
                  className="px-3 py-1 border text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ 
                    borderColor: "var(--border-accent)",
                    backgroundColor: "white",
                    color: "var(--foreground)"
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Menu */}
      {actionMenu.open && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={closeActionMenu}
          />
          <div
            className="absolute z-20 border py-1"
            style={{
              backgroundColor: "white",
              borderColor: "var(--border-accent)",
              top: actionMenu.position.top,
              left: actionMenu.position.left
            }}
          >
            {currentView === 'active' ? (
              // Active Schedule Actions
              <>
                <button
                  onClick={() => handleAction('pause', actionMenu.scheduleId)}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  style={{ color: "var(--foreground)" }}
                >
                  <Pause className="w-4 h-4 mr-2" />
                  Pause Schedule
                </button>
                <button
                  onClick={() => handleAction('resume', actionMenu.scheduleId)}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  style={{ color: "var(--foreground)" }}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Resume Schedule
                </button>
                <button
                  onClick={() => handleAction('update', actionMenu.scheduleId)}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  style={{ color: "var(--foreground)" }}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Edit Schedule
                </button>
                <button
                  onClick={() => handleAction('delete', actionMenu.scheduleId)}
                  className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                >
                  <Trash className="w-4 h-4 mr-2" />
                  Delete Schedule
                </button>
              </>
            ) : currentView === 'history' ? (
              // Call History Actions (Limited actions)
              <>
                <button
                  onClick={() => {
                    closeActionMenu();
                    const historyItem = currentData?.data?.find(item => item.id === actionMenu.scheduleId);
                    if (historyItem) {
                      alert(`Call Details:\nPhone: ${historyItem.phone}\nStatus: ${historyItem.status}\nDuration: ${historyItem.duration ? Math.floor(historyItem.duration / 60) + ':' + (historyItem.duration % 60).toString().padStart(2, '0') : 'N/A'}\nNotes: ${historyItem.notes || 'None'}`);
                    }
                  }}
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  style={{ color: "var(--foreground)" }}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  View Details
                </button>
              </>
            ) : (
              // Schedule Actions - Only Cancel option
              <>
                <button
                  onClick={() => handleAction('cancel', actionMenu.scheduleId)}
                  className="flex items-center px-4 py-2 text-sm text-orange-600 hover:bg-orange-50 w-full text-left"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel Schedule
                </button>
              </>
            )}
          </div>
        </>
      )}

      {/* Confirmation Modal */}

      {confirmAction.open && (
  <div className="fixed inset-0 z-50 overflow-y-auto">
    {/* Backdrop */}
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
 aria-hidden="true"></div>
    
    {/* Modal container - centers the modal */}
    <div className="flex items-center justify-center min-h-screen p-4">
      {/* Modal content */}
      <div 
        className="relative px-4 pt-5 pb-4 text-left overflow-hidden transform transition-all sm:max-w-lg sm:w-full sm:p-6 border"
        style={{ 
          backgroundColor: "white",
          borderColor: "var(--border-accent)"
        }}
      >
        <div>
          <div 
            className="mx-auto flex items-center justify-center h-12 w-12 border"
            style={{ 
              backgroundColor: "#fef2f2",
              borderColor: "#fecaca"
            }}
          >
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <div className="mt-3 text-center sm:mt-5">
            <h3 
              className="text-lg leading-6 font-medium"
              style={{ color: "var(--foreground)" }}
            >
              Confirm {confirmAction.type?.charAt(0).toUpperCase() + confirmAction.type?.slice(1)}
            </h3>
            <div className="mt-2">
              <p 
                className="text-sm"
                style={{ color: "var(--foreground)" }}
              >
                Are you sure you want to {confirmAction.type} this schedule? This action cannot be undone.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
          <button
            type="button"
            onClick={executeConfirmedAction}
            disabled={isSubmitting}
            className="w-full inline-flex justify-center border px-4 py-2 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:col-start-2 sm:text-sm disabled:opacity-50"
            style={{ 
              backgroundColor: "#dc2626",
              borderColor: "#dc2626"
            }}
          >
            {isSubmitting ? 'Processing...' : 'Confirm'}
          </button>
          <button
            type="button"
            onClick={() => setConfirmAction({ open: false, type: null, scheduleId: null })}
            className="mt-3 w-full inline-flex justify-center border px-4 py-2 text-base font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
            style={{ 
              backgroundColor: "white",
              borderColor: "var(--border-accent)",
              color: "var(--foreground)"
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
)}
      {/* {confirmAction.open && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75">

                  <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <AlertCircle className="h-6 w-6 text-red-600" />
                </div>
                <div className="mt-3 text-center sm:mt-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Confirm {confirmAction.type?.charAt(0).toUpperCase() + confirmAction.type?.slice(1)}
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to {confirmAction.type} this schedule? This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <button
                  type="button"
                  onClick={executeConfirmedAction}
                  disabled={isSubmitting}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:col-start-2 sm:text-sm disabled:opacity-50"
                >
                  {isSubmitting ? 'Processing...' : 'Confirm'}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmAction({ open: false, type: null, scheduleId: null })}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
              </div>
            </div>
          
          </div>
        </div>
      )} */}

      {/* Update Modal */}
      {updateScheduleModal.open && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <div 
              className="inline-block align-bottom px-4 pt-5 pb-4 text-left overflow-hidden transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6 border"
              style={{ 
                backgroundColor: "white",
                borderColor: "var(--border-accent)"
              }}
            >
              <div>
                <h3 
                  className="text-lg leading-6 font-medium mb-4"
                  style={{ color: "var(--foreground)" }}
                >
                  Update Schedule
                </h3>
                <div className="space-y-4">
                  <div>
                    <label 
                      className="block text-sm font-medium mb-1"
                      style={{ color: "var(--foreground)" }}
                    >
                      Notes
                    </label>
                    <textarea
                      value={updateScheduleModal.data.notes}
                      onChange={(e) => setUpdateScheduleModal(prev => ({
                        ...prev,
                        data: { ...prev.data, notes: e.target.value }
                      }))}
                      className="w-full border px-3 py-2 text-sm"
                      style={{ 
                        borderColor: "var(--border-accent)",
                        backgroundColor: "white",
                        color: "var(--foreground)"
                      }}
                      rows={3}
                      placeholder="Enter notes..."
                    />
                  </div>
                  <div>
                    <label 
                      className="block text-sm font-medium mb-1"
                      style={{ color: "var(--foreground)" }}
                    >
                      {currentView === 'active' ? 'Next Run Time' : 'Scheduled Time'}
                    </label>
                    <input
                      type="datetime-local"
                      value={updateScheduleModal.data.scheduled_at ? new Date(updateScheduleModal.data.scheduled_at).toISOString().slice(0, 16) : ''}
                      onChange={(e) => setUpdateScheduleModal(prev => ({
                        ...prev,
                        data: { ...prev.data, scheduled_at: e.target.value }
                      }))}
                      className="w-full border px-3 py-2 text-sm"
                      style={{ 
                        borderColor: "var(--border-accent)",
                        backgroundColor: "white",
                        color: "var(--foreground)"
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <button
                  type="button"
                  onClick={handleUpdateSchedule}
                  disabled={isSubmitting}
                  className="w-full inline-flex justify-center border px-4 py-2 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm disabled:opacity-50"
                  style={{ 
                    backgroundColor: "#2563eb",
                    borderColor: "#2563eb"
                  }}
                >
                  {isSubmitting ? 'Updating...' : 'Update'}
                </button>
                <button
                  type="button"
                  onClick={() => setUpdateScheduleModal({
                    open: false,
                    scheduleId: null,
                    data: { notes: "", scheduled_at: "" },
                    original: null
                  })}
                  className="mt-3 w-full inline-flex justify-center border px-4 py-2 text-base font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                  style={{ 
                    backgroundColor: "white",
                    borderColor: "var(--border-accent)",
                    color: "var(--foreground)"
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}