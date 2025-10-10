
"use client";
// NOTE: Signup page is intentionally disabled for now. We preserve the original implementation below
// in a block comment to avoid losing functionality. While disabled, we redirect users to the
// marketing funnel so they must complete the funnel and payment before accessing the dashboard.

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SignUpPageRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/getting-started');
  }, [router]);
  return null;
}

// --------------------
// Original SignUpPage code preserved for later re-enable (commented out)
// --------------------
// "use client";
// import { useState, useEffect, useRef } from 'react';
// import { useAuth } from '../../../store/hooks';
// import { useRouter } from 'next/navigation';
// 
// export default function SignUpPage() {
//   const [registrationType, setRegistrationType] = useState('individual');
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//     phone: '',
//     // TODO: Re-enable organization fields when organization registration is available
//     // website_link: '',
//     // admin_name: '',
//     // organization_license: ''
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [agreeToTerms, setAgreeToTerms] = useState(false);
//   const [error, setError] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);
// 
//   const { registerUser, loading } = useAuth();
//   const { loginWithGoogle } = useAuth();
//   const router = useRouter();
//   const googleBtnRef = useRef(null);
//   const [googleReady, setGoogleReady] = useState(false);
// 
//   const handleInputChange = (field, value) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };
// 
//   const validateForm = () => {
//     const { name, email, password, confirmPassword } = formData;
//     // TODO: Re-enable organization field validation when organization registration is available
//     // const { name, email, password, confirmPassword, organization_license, website_link } = formData;
// 
//     if (!name || !email || !password || !confirmPassword) {
//       setError('All required fields must be filled');
//       return false;
//     }
// 
//     // TODO: Re-enable organization validation when organization registration is available
//     // if (registrationType === 'organization' && !organization_license) {
//     //   setError('Organization license number is required for organization registration');
//     //   return false;
//     // }
// 
//     // // Validation for organization_license - must contain "ram"
//     // if (registrationType === 'organization' && !organization_license.toLowerCase().includes('ram')) {
//     //   setError('Organization license number must be valid');
//     //   return false;
//     // }
// 
//     // // Validation for website_link - must be a valid URL if provided
//     // if (website_link) {
//     //   try {
//     //     new URL(website_link);
//     //   } catch (err) {
//     //     setError('Website link must be a valid URL');
//     //     return false;
//     //   }
//     // }
// 
//     if (password !== confirmPassword) {
//       setError('Passwords do not match');
//       return false;
//     }
// 
//     if (password.length < 8) {
//       setError('Password must be at least 8 characters long');
//       return false;
//     }
// 
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       setError('Please enter a valid email address');
//       return false;
//     }
// 
//     if (!agreeToTerms) {
//       setError('Please agree to the Terms of Service and Privacy Policy');
//       return false;
//     }
// 
//     return true;
//   };
// 
//   const handleSubmit = async () => {
//     setError('');
// 
//     if (!validateForm()) {
//       return;
//     }
// 
//     try {
//       setIsSubmitting(true);
// 
//       const registrationData = {
//         email: formData.email,
//         password: formData.password,
//         name: formData.name,
//         phone: formData.phone || null,
//         plan: null,
//         type: registrationType,
//         // TODO: Re-enable organization-specific fields when organization registration is available
//         // website_link: formData.website_link || null,
//         // ...(registrationType === 'organization' && { organization_license: formData.organization_license })
//       };
//       console.log("Registration Data:", registrationData);
// 
//       const result = await registerUser(registrationData);
// 
//               if (result.success) {
//           // After successful registration, send OTP and redirect to verify page
//           // OTP already sent by server; redirect user to verification page
//           router.push(`/auth/verify?email=${encodeURIComponent(formData.email)}`);
// 
//       } else {
//         setError(result.error || 'Registration failed. Please check your connection and try again.');
//       }
//     } catch (err) {
//       console.error('Signup error:', err);
//       setError('An unexpected error occurred. Please try again later.');
//     } finally {
//       setIsSubmitting(false);
//     }
//   };
// 
//   // Google Identity Services setup (allow signup via Google)
//   useEffect(() => {
//     const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
//     if (!clientId) {
//       console.warn('NEXT_PUBLIC_GOOGLE_CLIENT_ID not configured');
//       return;
//     }
// 
//     const init = () => {
//       try {
//         // /* global google */
//         if (window.google?.accounts?.id) {
//           window.google.accounts.id.initialize({
//             client_id: clientId,
//             callback: async (response) => {
//               try {
//                 setError(''); // Clear any previous errors
//                 setIsSubmitting(true);
//                 const result = await loginWithGoogle(response.credential);
//                 if (result.success) {
//                   const user = result.user;
//                   if (user?.role === 'admin') {
//                     router.push('/dashboard/admin');
//                   } else {
//                     router.push('/dashboard/individual');
//                   }
//                 } else {
//                   setError(result.error || 'Google sign-in failed');
//                 }
//               } catch (e) {
//                 console.error('Google sign-in error:', e);
//                 setError(e.message || 'Google sign-in failed. Please try again.');
//               } finally {
//                 setIsSubmitting(false);
//               }
//             },
//           });
//           if (googleBtnRef.current) {
//             try {
//               window.google.accounts.id.renderButton(googleBtnRef.current, {
//                 theme: 'outline',
//                 size: 'large',
//                 width: 360,
//                 shape: 'rectangular',
//                 logo_alignment: 'left',
//               });
//               setGoogleReady(true);
//             } catch (renderError) {
//               console.error('Google button render error:', renderError);
//             }
//           }
//         }
//       } catch (initError) {
//         console.error('Google Identity Services initialization error:', initError);
//       }
//     };
// 
//     if (!window.google) {
//       const script = document.createElement('script');
//       script.src = 'https://accounts.google.com/gsi/client';
//       script.async = true;
//       script.defer = true;
//       script.onload = init;
//       document.body.appendChild(script);
//     } else {
//       init();
//     }
//   }, [loginWithGoogle, router]);
// 
//   return (
//     <div className="min-h-screen relative bg-beige flex items-center justify-center p-4" style={{ fontFamily: '"Mier A", sans-serif' }}>
//       {/* Soft background blobs (match landing palette) */}
//       <div className="absolute inset-0 pointer-events-none overflow-hidden">
//         <div className="absolute top-20 left-10 w-48 h-48 bg-gradient-to-r from-[#E6D3E7] to-[#F6D9D5] mix-blend-multiply filter blur-2xl opacity-15 animate-pulse"></div>
//         <div className="absolute top-40 right-10 w-56 h-56 bg-gradient-to-r from-[#F6D9D5] to-[#D6E3EC] mix-blend-multiply filter blur-2xl opacity-15 animate-pulse animation-delay-2000"></div>
//         <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-52 h-52 bg-gradient-to-r from-[#D6E3EC] to-[#E6D3E7] mix-blend-multiply filter blur-2xl opacity-15 animate-pulse animation-delay-4000"></div>
//       </div>
// 
//       <div className="relative w-full max-w-6xl">
//         <div className="grid lg:grid-cols-2 gap-8 items-center">
//           {/* Left Column - Welcome Section */}
//           <div className="text-center lg:text-left space-y-6">
//             
// 
//             <div>
//               <h1 className="text-3xl md:text-5xl text-gray-900 mb-4 leading-tight">
//                 Welcome to Noyco
//               </h1>
//               <p className="text-lg text-gray-600 mb-6">
//                 Join thousands of healthcare professionals transforming patient care through our innovative platform
//               </p>
//             </div>
// 
//             <div className="space-y-4">
//               <div className="flex items-center space-x-3 text-gray-700">
//                 <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
//                   <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                   </svg>
//                 </div>
//                 <span>HIPAA compliant and secure</span>
//               </div>
//               <div className="flex items-center space-x-3 text-gray-700">
//                 <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
//                   <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                   </svg>
//                 </div>
//                 <span>24/7 support and training</span>
//               </div>
//               <div className="flex items-center space-x-3 text-gray-700">
//                 <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
//                   <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                   </svg>
//                 </div>
//                 <span>Seamless integration with existing systems</span>
//               </div>
//             </div>
// 
//             <div className="bg-beige  p-6 shadow-sm border-accent border-accent-top border-accent-left border-accent-right">
//               <span className="text-gray-600">Already have an account? </span>
//               <button
//                 onClick={() => router.push('/auth/login')}
//                 className="text-gray-800 hover:text-gray-900 ">
//                 Sign In →
//               </button>
//             </div>
//           </div>
// 
//           {/* Right Column - Registration Form */}
//           <div className="bg-beige rounded-none shadow border-accent border-accent-top border-accent-left border-accent-right p-8 relative overflow-hidden">
//             <div className="absolute inset-0 bg-beige rounded-none  pointer-events-none"></div>
// 
//             <div className="relative z-10">
//               <div className="text-center mb-6">
//                 <h2 className="text-2xl font-medium text-gray-900 mb-2">Create Account</h2>
//                 <p className="text-gray-600">Start your journey with Noyco</p>
//               </div>
// 
//               {/* Registration Type Toggle - Organization temporarily disabled */}
//               {/* <div className="mb-6">
//                 <div className="flex bg-gray-100 rounded-none p-1 border-accent border-accent-top border-accent-left border-accent-right"> */}
//                 {/* TODO: Re-enable organization registration when ready */}
//                 {/* <button
//                   type="button"
//                   onClick={() => setRegistrationType('organization')}
//                   className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all duration-300 ${registrationType === 'organization'
//                     ? 'bg-white text-blue-600 shadow-md transform scale-105'
//                     : 'text-gray-600 hover:text-gray-800'
//                     }`}
//                 >
//                   <div className="flex items-center justify-center space-x-2">
//                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
//                     </svg>
//                     <span>Organization</span>
//                   </div>
//                 </button> */}
//                 {/* <button
//                   type="button"
//                   onClick={() => setRegistrationType('individual')}
//                   className={`w-full py-2 px-3 rounded-xl text-sm font-medium transition-all duration-300 bg-white text-gray-800 shadow-sm`}
//                 >
//                   <div className="flex items-center justify-center space-x-2">
//                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//                     </svg>
//                     <span>Individual Registration</span>
//                   </div>
//                 </button>
//               </div>
//             </div> */}
// 
//               {/* Error Message */}
//               {error && (
//                 <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-center space-x-2">
//                   <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                   </svg>
//                   <span>{error}</span>
//                 </div>
//               )}
// 
//               {/* Google Sign-Up */}
//               <div className="mb-4">
//                 <div ref={googleBtnRef} className="flex justify-center" />
//                 {!googleReady && (
//                   <button
//                     type="button"
//                     onClick={() => { try { window.google?.accounts?.id?.prompt(); } catch {} }}
//                     disabled={isSubmitting || loading}
//                     className="w-full border border-gray-300 hover:bg-gray-50 text-gray-900 font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 bg-white"
//                   >
//                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
//                       <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12 c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C32.769,6.053,28.576,4,24,4C12.955,4,4,12.955,4,24 s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
//                       <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,16.108,18.961,14,24,14c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657 C32.769,6.053,28.576,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
//                       <path fill="#4CAF50" d="M24,44c4.522,0,8.646-1.732,11.77-4.565l-5.424-4.594C28.313,35.584,26.262,36,24,36 c-5.202,0-9.615-3.317-11.271-7.946l-6.5,5.017C9.551,39.556,16.227,44,24,44z"/>
//                       <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.027,5.557 c0.001-0.001,0.002-0.001,0.003-0.002l5.424,4.594C35.995,38.252,44,32,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
//                     </svg>
//                     Continue with Google
//                   </button>
//                 )}
//               </div>
// 
//               {/* Form Fields - Compact Layout */}
//               <div className="space-y-4">
//                 {/* Name and Phone Row - Individual Registration Only */}
//                 <div className="grid grid-cols-2 gap-3">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Full Name<span className="text-red-500 ml-1">*</span>
//                     </label>
//                     <input
//                       type="text"
//                       value={formData.name}
//                       onChange={(e) => handleInputChange('name', e.target.value)}
//                       className="w-full px-3 py-2 bg-beige text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0 focus:shadow-none focus:border-blue-500 transition-all duration-200 text-sm rounded-none border-accent border-accent-top border-accent-left border-accent-right"
//                       placeholder="Your full name"
//                       required
//                     />
//                   </div>
// 
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
//                     <input
//                       type="tel"
//                       value={formData.phone}
//                       onChange={(e) => handleInputChange('phone', e.target.value)}
//                       className="w-full px-3 py-2 bg-beige border-accent  border-accent-left border-accent-right border-accent-top text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 text-sm"
//                       placeholder="Phone number"
//                     />
//                   </div>
// 
//                   {/* TODO: Re-enable organization fields when organization registration is available */}
//                   {/* {registrationType === 'organization' ? (
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">
//                         License #<span className="text-red-500 ml-1">*</span>
//                       </label>
//                       <input
//                         type="text"
//                         value={formData.organization_license}
//                         onChange={(e) => handleInputChange('organization_license', e.target.value)}
//                         className="w-full px-3 py-2 bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 text-sm"
//                         placeholder="License number"
//                         required
//                       />
//                     </div>
//                   ) : (
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
//                       <input
//                         type="tel"
//                         value={formData.phone}
//                         onChange={(e) => handleInputChange('phone', e.target.value)}
//                         className="w-full px-3 py-2 bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 text-sm"
//                         placeholder="Phone number"
//                       />
//                     </div>
//                   )} */}
//                 </div>
// 
//                 {/* Email Row - Individual Registration Only */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Email<span className="text-red-500 ml-1">*</span>
//                   </label>
//                   <input
//                     type="email"
//                     value={formData.email}
//                     onChange={(e) => handleInputChange('email', e.target.value)}
//                     className="w-full px-3 py-2 bg-beige  border-accent border-accent-top border-accent-left border-accent-right    focus:outline-none focus:ring-0 focus:shadow-none focus:border-blue-500 transition-all duration-200 text-sm"
//                     placeholder="your@email.com"
//                     required
//                   />
//                 </div>
// 
//                 {/* TODO: Re-enable organization-specific fields when organization registration is available */}
//                 {/* <div className="grid grid-cols-2 gap-3">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Email<span className="text-red-500 ml-1">*</span>
//                     </label>
//                     <input
//                       type="email"
//                       value={formData.email}
//                       onChange={(e) => handleInputChange('email', e.target.value)}
//                       className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0 focus:shadow-none focus:border-blue-500 transition-all duration-200 text-sm"
//                       placeholder="your@email.com"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <label className="block text sm font-medium text-gray-700 mb-1">
//                       {registrationType === 'organization' ? 'Website' : 'Phone'}
//                     </label>
//                     <input
//                       type={registrationType === 'organization' ? 'url' : 'tel'}
//                       value={registrationType === 'organization' ? formData.website_link : formData.phone}
//                       onChange={(e) => handleInputChange(registrationType === 'organization' ? 'website_link' : 'phone', e.target.value)}
//                       className="w-full px-3 py-2 bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 text-sm"
//                       placeholder={registrationType === 'organization' ? 'yoursite.com' : 'Phone number'}
//                     />
//                   </div>
//                 </div> */}
// 
//                 {/* TODO: Re-enable admin name field when organization registration is available */}
//                 {/* {registrationType === 'organization' && (
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Admin Name</label>
//                     <input
//                       type="text"
//                       value={formData.admin_name}
//                       onChange={(e) => handleInputChange('admin_name', e.target.value)}
//                       className="w-full px-3 py-2 bg-white/70 backdrop-blur-sm border border-gray-200/50 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-200 text-sm"
//                       placeholder="Administrator name"
//                     />
//                   </div>
//                 )} */}
// 
//                 {/* Password Row */}
//                 <div className="grid grid-cols-2 gap-3">
//                   <div className="relative">
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Password<span className="text-red-500 ml-1">*</span>
//                     </label>
//                     <input
//                       type={showPassword ? "text" : "password"}
//                       value={formData.password}
//                       onChange={(e) => handleInputChange('password', e.target.value)}
//                       className="w-full px-3 py-2 bg-beieg border-accent border-accent-top border-accent-left border-accent-right  text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0 focus:shadow-none focus:border-blue-500 transition-all duration-200 text-sm pr-10"
//                       placeholder="Password"
//                       required
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowPassword(!showPassword)}
//                       className="absolute right-3 top-8 text-gray-400 hover:text-gray-600 transition-colors"
//                     >
//                       {showPassword ? (
//                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
//                         </svg>
//                       ) : (
//                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                         </svg>
//                       )}
//                     </button>
//                   </div>
//                   <div className="relative">
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Confirm<span className="text-red-500 ml-1">*</span>
//                     </label>
//                     <input
//                       type={showConfirmPassword ? "text" : "password"}
//                       value={formData.confirmPassword}
//                       onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
//                       className="w-full px-3 py-2 bg-beige text-gray-900 placeholder-gray-500  text-sm pr-10 rounded-none border-accent border-accent-top border-accent-left border-accent-right"
//                       placeholder="Confirm"
//                       required
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                       className="absolute right-3 top-8 text-gray-400 hover:text-gray-600 transition-colors"
//                     >
//                       {showConfirmPassword ? (
//                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
//                         </svg>
//                       ) : (
//                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                         </svg>
//                       )}
//                     </button>
//                   </div>
//                 </div>
// 
//                 <div className="text-xs text-gray-500">
//                   Password must be at least 8 characters long
//                 </div>
// 
//                 {/* Terms Checkbox */}
//                 <div className="flex items-start space-x-2">
//                   <input
//                     id="terms"
//                     type="checkbox"
//                     checked={agreeToTerms}
//                     onChange={(e) => setAgreeToTerms(e.target.checked)}
//                     className="mt-1 w-4 h-4 text-gray-800 bg-beige rounded-none focus:ring-0 focus:outline-none"
//                   />
//                   <label htmlFor="terms" className="text-sm text-gray-600">
//                     I agree to the{' '}
//                     <button type="button" className="text-blue-600 hover:text-blue-700 font-medium underline">
//                       Terms of Service
//                     </button>{' '}
//                     and{' '}
//                     <button type="button" className="text-blue-600 hover:text-blue-700 font-medium underline">
//                       Privacy Policy
//                     </button>
//                   </label>
//                 </div>
// 
//                 {/* Submit Button */}
//                 <button
//                   type="button"
//                   onClick={handleSubmit}
//                   disabled={isSubmitting || loading}
//                   className="w-full bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] hover:shadow-lg disabled:opacity-70 text-gray-800 font-medium py-3 px-6 rounded-none transition-all duration-200 disabled:cursor-not-allowed border-accent border-accent-top border-accent-left border-accent-right"
//                 >
//                   {isSubmitting || loading ? (
//                     <div className="flex items-center justify-center">
//                       <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-800" fill="none" viewBox="0 0 24 24">
//                         <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                         <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                       </svg>
//                       Creating Account...
//                     </div>
//                   ) : (
//                     'Create Individual Account'
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
// 
//         {/* Footer */}
//         <div className="mt-6 text-center">
//           <div className="text-xs text-gray-500 space-y-2">
//             <div className="flex justify-center space-x-6">
//               <button className="hover:text-gray-700 transition-colors">Privacy Policy</button>
//               <button className="hover:text-gray-700 transition-colors">Terms of Use</button>
//               <button className="hover:text-gray-700 transition-colors">Support</button>
//             </div>
//             <div className="text-gray-400">
//               © 2025 Noyco Inc. All rights reserved.
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
