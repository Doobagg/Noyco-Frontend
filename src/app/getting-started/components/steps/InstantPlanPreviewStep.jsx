"use client"

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useMarketingFunnel } from '../../context/MarketingFunnelContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Target, Clock, Zap, Smartphone, Heart, BookOpen, CheckCircle, XCircle, Star } from 'lucide-react';
import { apiRequest } from '@/lib/api';
import { createPublicSubscription } from '@/stripe/services/checkoutService';

const InstantPlanPreviewStep = () => {
  const { data } = useMarketingFunnel();
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState('IND_1M');
  const [plans, setPlans] = useState([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [creatingCheckout, setCreatingCheckout] = useState(false);
  const email = data?.email || '';

  useEffect(() => {
    let mounted = true;
    const loadPlans = async () => {
      try {
        const res = await apiRequest('/public/billing/plans');
        if (mounted) setPlans(res.plans || []);
      } catch (e) {
        console.error('Failed to load plans', e);
      } finally {
        if (mounted) setLoadingPlans(false);
      }
    };
    loadPlans();
    return () => { mounted = false; };
  }, []);

  // Get user's name from email
  const getUserName = () => {
    if (data.email) {
      const name = data.email.split('@')[0];
      return name.charAt(0).toUpperCase() + name.slice(1);
    }
    return 'Your';
  };

  const startCheckout = async () => {
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      alert('Please provide a valid email earlier in the flow.');
      return;
    }
    if (!selectedPlan) {
      alert('Please select a plan');
      return;
    }
    try {
      setCreatingCheckout(true);
      // Pre-create the public subscription so the subscribe page can render Payment Element immediately
      const res = await createPublicSubscription(email, selectedPlan);
      if (res?.client_secret && res?.subscription_id) {
        try {
          sessionStorage.setItem(
            'pre_checkout',
            JSON.stringify({ cs: res.client_secret, sid: res.subscription_id })
          );
        } catch (error){
          console.error('Unable to store pre_checkout in sessionStorage', error);
        }
      }
      // Navigate to subscribe with params (no autostart needed; page will consume pre_checkout)
      const params = new URLSearchParams({ email, plan: selectedPlan });
      router.push(`/billing/subscribe?${params.toString()}`);
    } catch (e) {
      console.error('Checkout creation failed', e);
      alert(e.message || 'Unable to start checkout');
    } finally {
      setCreatingCheckout(false);
    }
  };

  const selections = [
    { label: 'Primary focus', value: data.primaryTopic || '—', color: 'text-gray-700' },
    { label: '30-day outcome', value: data.goal30 || '—', color: 'text-gray-700', },
    { label: 'Intensity', value: typeof data.intensity === 'number' && data.intensity > 0 ? `${data.intensity}/10` : '—', color: 'text-gray-700', },
    { label: 'Time budget', value: data.timeBudget || '—', color: 'text-gray-700',  },
    { label: 'Support style', value: data.supportStyle || '—', color: 'text-gray-700',  },
    { label: 'Accountability', value: data.accountabilityStyle || '—', color: 'text-gray-700',  },
    { label: 'Coping anchors', value: (data.copingAnchors && data.copingAnchors.length) ? data.copingAnchors.slice(0,3).join(', ') : '—', color: 'text-gray-700',  },
    { label: 'Triggers', value: (data.triggers && data.triggers.length) ? data.triggers.slice(0,3).join(', ') : '—', color: 'text-gray-700', },
    { label: 'Patterns', value: (data.symptomPatterns && data.symptomPatterns.length) ? data.symptomPatterns.slice(0,2).join(', ') : '—', color: 'text-gray-700', },
  ];

  // Friendly marketing presentation for the three primary individual plans.
  // NOTE: This is presentation-only. Stripe uses the plan `code` (e.g., IND_1M),
  // which we keep intact via selectedPlan + createPublicSubscription.
  // Helper to split server priceDisplay like
  // "$16.66 /month (Billed $49.99 every 3 months)" → { monthly: "$16.66 /month", billed: "Billed $49.99 every 3 months" }
  const parsePriceDisplay = (code) => {
    const pd = plans.find(p => p.code === code)?.priceDisplay || '';
    if (!pd) return { monthly: '', billed: '' };
    const m = pd.match(/^([^()]+?)(?:\s*\(([^)]+)\))?$/);
    if (!m) return { monthly: pd, billed: '' };
    return { monthly: (m[1] || '').trim(), billed: (m[2] || '').trim() };
  };

  const IND_1M_PRICE = parsePriceDisplay('IND_1M');
  const IND_3M_PRICE = parsePriceDisplay('IND_3M');
  const IND_6M_PRICE = parsePriceDisplay('IND_6M');

  const DISPLAY_BY_CODE = {
    IND_1M: {
      name: 'The Starter Journey',
      sub: 'Flex Plan',
      monthly: IND_1M_PRICE.monthly || '$19.99 /month',
      billed: IND_1M_PRICE.billed || '',
      helper: 'Perfect for testing the waters.',
      gradient: 'from-[#A4E5FF] to-[#7FD3FF]',
      badge: 'MOST POPULAR',
    },
    IND_3M: {
      name: 'The Transformation',
      sub: 'Recommended Path',
      monthly: IND_3M_PRICE.monthly || '$16.66 /month',
      billed: IND_3M_PRICE.billed,
      helper: 'Best value for building a habit.',
      gradient: 'from-[#FFE0B5] to-[#FFC9A1]',
      badge: null,
    },
    IND_6M: {
      name: 'The Deep Dive',
      sub: 'Commitment Plan',
      monthly: IND_6M_PRICE.monthly || '$13.33 /month',
      billed: IND_6M_PRICE.billed ,
      helper: 'Lock in your lowest price.',
      gradient: 'from-[#DCC6FF] to-[#B9A9FF]',
      badge: null,
    },
  };

  const planCards = plans
    .filter(p => ['IND_1M', 'IND_3M', 'IND_6M'].includes(p.code))
    .map((p) => {
      const d = DISPLAY_BY_CODE[p.code] || {
        name: `${p.months}-Month Plan`,
        sub: '',
        priceLine: p.priceDisplay || '',
        helper: '',
        gradient: 'from-white to-gray-50',
        badge: null,
      };
      return {
        id: p.code,
        ...d,
      };
    });
  
  const getPreviewParagraph = () => {
    const focus = data.primaryTopic || 'your wellbeing';
    const outcome = data.goal30 || 'meaningful progress';
    const time = data.timeBudget || 'a few minutes a day';
    const support = data.supportStyle || 'support that fits you';
    const accountability = data.accountabilityStyle || 'gentle accountability';
    const intensity = typeof data.intensity === 'number' && data.intensity > 0 ? `${data.intensity}/10` : null;
    const triggers = (data.triggers && data.triggers.length) ? data.triggers.slice(0,2).join(', ') : null;
    const anchors = (data.copingAnchors && data.copingAnchors.length) ? data.copingAnchors.slice(0,2).join(' & ') : null;

    let parts = [
      `We built a plan focused on ${focus} to help you achieve ${outcome}.`,
      `It fits into ${time} with ${support} and ${accountability}.`
    ];
    if (intensity) parts.push(`Your current intensity is ${intensity}, so we start light and build confidence.`);
    if (triggers) parts.push(`We’ll address your triggers like ${triggers} with step‑by‑step techniques.`);
    if (anchors) parts.push(`You’ll also lean on anchors like ${anchors} when you need a quick reset.`);
    return parts.join(' ');
  };
  

  const getPlanDisclaimer = (code) => {
    switch (code) {
      case 'IND_1M':
        return "By clicking 'Get my plan', you agree to automatic renewal. First month $19.99, then $29.99 per month thereafter.";
      case 'IND_3M':
      case 'BNDL_3M':
        return "By clicking 'Get my plan', you agree to automatic renewal. First 3 months $49.99 total, then $29.99 per month.";
      case 'IND_6M':
      case 'BNDL_6M':
        return "By clicking 'Get my plan', you agree to automatic renewal. First 6 months $79.99 total, then $29.99 per month.";
      default:
        return "By clicking 'Get my plan', you agree to automatic renewal. Cancel anytime.";
    }
  };

  return (
  <div className="space-y-8 max-w-2xl mx-auto instant-plan-wrapper">
     
      {/* Header */}
      <motion.div
        className="text-center space-y-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
      >
        <h1 className="text-2xl font-normal text-gray-900">
          {getUserName()}, here’s a snapshot of your
          <br />
          <span className="text-gray-600">personalized plan</span>
        </h1>
        <p className="text-sm text-gray-500">Tailored from your selections in the flow</p>
      </motion.div>

      

      {/* Before / After emotional state illustration (responsive) */}
      <motion.div
        className="w-full"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        {/* <div className="grid gap-8 sm:gap-10 sm:grid-cols-2 items-start"> */}
        
        
          {/* <div className="flex flex-col items-center text-center">
            <div className="relative w-full max-w-[180px] xs:max-w-[200px] sm:max-w-[180px] md:max-w-[200px] aspect-square">
              <Image
                src="/sad.png"
                alt="Before using plan: feeling low"
                fill
                sizes="(max-width: 640px) 180px, (max-width: 768px) 200px, 200px"
                className="object-contain"
                priority
              />
            </div>
            <div className="mt-4 text-sm font-medium text-gray-500 uppercase tracking-wide">Before</div>
          </div>

          

          <div className="flex flex-col items-center text-center">
            <div className="relative w-full max-w-[180px] xs:max-w-[200px] sm:max-w-[180px] md:max-w-[200px] aspect-square">
              <Image
                src="/happy.png"
                alt="After following plan: calmer and uplifted"
                fill
                sizes="(max-width: 640px) 180px, (max-width: 768px) 200px, 200px"
                className="object-contain"
                priority
              />
            </div>
            <div className="mt-4 text-sm font-medium text-gray-500 uppercase tracking-wide">After</div>
          </div> */}



              <Image
                src="/trans.png"
                alt="After following plan: calmer and uplifted"
                width={500}
                height={500}
                priority
              />




        {/* </div> */}


        {/* Subtle connector for larger screens */}
        <div className="hidden sm:flex justify-center mt-4 text-[11px] text-gray-400 tracking-wide">
          Guided micro-habits over 30 days → gradual mood shift
        </div>

      </motion.div>






      {/* Highlights of your plan as lines */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.35 }}
      >
        <h2 className="text-center text-lg font-semibold text-gray-900 mb-4 mt-18">Highlights of your plan</h2>
        <div className="space-y-3">
          {(() => {
            const tb = (data.timeBudget || '').toLowerCase();
            const minutes = tb.match(/\d+/)?.[0] || '5';
            const triggersSample = (data.triggers && data.triggers.length) ? data.triggers.slice(0,2).join(', ') : 'your triggers';
            const patternsSample = (data.symptomPatterns && data.symptomPatterns.length) ? data.symptomPatterns.slice(0,2).join(', ') : 'your patterns';
            const supportLine = data.supportStyle
              ? `Support that matches your style (**${data.supportStyle}**${data.accountabilityStyle ? `, **${data.accountabilityStyle} accountability**` : ''}).`
              : 'Flexible support and gentle accountability.';

            const lines = [
              {
                icon: Target,
                text: `Personalized day‑by‑day plan based on **${data.primaryTopic || 'your focus'}**, **${triggersSample}** and **${patternsSample}**.`
              },
              {
                icon: Clock,
                text: `Practice‑focused **${minutes}-minute** techniques that fit into your routine.`
              },
              {
                icon: Zap,
                text: 'Rapid relief toolkit in your pocket — accessible anytime, anywhere.'
              },
              {
                icon: Smartphone,
                text: 'Zero equipment — do it anywhere with just your body and mind.'
              },
              {
                icon: Heart,
                text: supportLine
              },
              {
                icon: BookOpen,
                text: 'Research‑based guidance for reliable results.'
              }
            ];

            return lines.map((line, i) => {
              const Icon = line.icon;
              // Convert **text** to bold
              const textWithBold = line.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
              
              return (
                <div key={i} className="flex items-start">
                  <Icon className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                  <p 
                    className="text-sm text-gray-800 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: textWithBold }}
                  />
                </div>
              );
            });
          })()}
        </div>
      </motion.div>

              
     
      {/* Pricing - Stacked rectangular cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.75 }}



      >
        {/* Transformation highlights: two-column comparison */}
        {/* <div className="mb-6">
          <h3 className="text-center text-lg font-semibold text-gray-900 mb-4">Transform Your Wellness in 4 Weeks</h3>
          {(() => {
            const items = [
              'Stress-free mornings and peaceful evenings',
              'Crystal clear focus throughout your day',
              'Steady energy without the crashes',
              'Deep, restorative sleep every night',
              'Confidence in social connections',
              'Freedom from anxiety and worry',
              'A calmer, stronger version of yourself',
            ];
            return (
              <div className="bg-white   border-gray-200 p-5">
                <div className="grid [grid-template-columns:1fr_auto_auto] gap-x-2 gap-y-2 items-center">
                  <div></div>
                  <div className="text-xs font-semibold text-gray-600 text-right pr-1">With Noyco</div>
                  <div className="text-xs font-semibold text-gray-600 text-right">Without Noyco</div>
                  {items.map((text, idx) => (
                    <div className="contents" key={`row-${idx}`}>
                      <div className="text-sm text-gray-800 whitespace-nowrap truncate pr-2">{text}</div>
                      <div className="flex items-center justify-end">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="flex items-center justify-end">
                        <XCircle className="w-4 h-4 text-red-500" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div> */}



<div className="mb-10">
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden max-w-2xl mx-auto">
    {/* Header */}
    <div className="bg-gradient-to-b from-green-50 to-transparent px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-5 h-5 text-green-600"
        >
          <path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2z" />
        </svg>
        <h3 className="text-gray-900 font-semibold text-lg">
          Noyco
        </h3>
      </div>
      <div className="flex gap-6 text-sm font-medium">
        <div className="flex items-center gap-1 text-green-700">
          <div className="bg-green-100 rounded-full p-1">
            <CheckCircle className="w-4 h-4 text-green-600" />
          </div>
          <span>With</span>
        </div>
        <div className="flex items-center gap-1 text-red-600">
          <div className="bg-red-100 rounded-full p-1">
            <XCircle className="w-4 h-4 text-red-500" />
          </div>
          <span>Without</span>
        </div>
      </div>
    </div>

    {/* Comparison Table */}
    <div className="divide-y divide-gray-100 px-6 py-4">
      {[
        'Stress-free mornings and evenings',
        'Crystal clear focus throughout your day',
        'Steady energy without the crashes',
        'Deep, restorative sleep every night',
        'Confidence in social connections',
        'Freedom from anxiety and worry',
        'A calmer, stronger version of yourself',
      ].map((item, i) => (
        <div
          key={i}
          className="grid grid-cols-[1fr_auto_auto] gap-x-4 py-3 items-center"
        >
          <div className="text-gray-800 text-sm">{item}</div>
          <div className="flex justify-center mr-16" >
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <div className="flex justify-center mr-4">
            <XCircle className="w-5 h-5 text-red-500" />
          </div>
        </div>
      ))}
    </div>
  </div>
</div>




          {/* Transform image placed immediately after comparison */}
          <div className="flex justify-center mt-2">
            <div className="w-full max-w-[420px] md:max-w-[600px]">
              <Image
                src="/noycofp.png"
                alt="Transform preview"
                width={600}
                height={600}
                className="w-full h-auto"
                priority
              />
            </div>
          </div>






          {/* Reviews / Testimonials */}
          {/* <div className="mt-6">
            <h4 className="text-center text-md font-semibold text-gray-900 mb-4">What people are saying</h4>
            <div className="space-y-4">
              {[
                {
                  name: 'Stacy',
                  text: 'I finally sleep through the night and wake up calmer. The daily steps are simple and effective.',
                },
                {
                  name: 'Michael',
                  text: 'My focus and energy improved in two weeks — this felt like a personal coach in my pocket.',
                },
                {
                  name: 'Sofia',
                  text: 'Practical, research-backed techniques. Less anxiety, more confidence in social situations.',
                }
              ].map((r, i) => (
                <div key={i} className="bg-white  p-4 rounded-md w-full">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-800">{r.name.split(' ')[0].charAt(0)}</div>
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{r.name}</div>
                          <div className="flex items-center text-yellow-500">
                      <Star className="w-4 h-4" />
                      <Star className="w-4 h-4" />
                      <Star className="w-4 h-4" />
                      <Star className="w-4 h-4" />
                      <Star className="w-4 h-4 text-yellow-400" />
                    </div>
                      </div>
                    </div>
                  
                  </div>
                  <p className="text-sm text-gray-700">{r.text}</p>
                </div>
              ))}
            </div>
          </div> */}


       <div className="mt-10">
  <h4 className="text-center text-2xl font-normal text-gray-900 mb-6">
    What people are saying
  </h4>
  <div className="space-y-5 max-w-lg mx-auto">
    {[
      {
        name: 'Stacy',
        text: 'I finally sleep through the night and wake up calmer. The daily steps are simple and effective.',
        gradient: 'from-green-200 to-green-400',
      },
      {
        name: 'Michael',
        text: 'My focus and energy improved in two weeks — this felt like a personal coach in my pocket.',
        gradient: 'from-orange-200 to-orange-400',
      },
      {
        name: 'Sofia',
        text: 'Practical, research-backed techniques. Less anxiety, more confidence in social situations.',
        gradient: 'from-purple-200 to-purple-400',
      },
    ].map((r, i) => (
      <div
        key={i}
        className="bg-beige p-5 rounded-2xl shadow-sm border border-gray-100"
      >
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div
            className={`w-12 h-12 rounded-full bg-gradient-to-br ${r.gradient} flex items-center justify-center text-base font-semibold text-white shadow-sm flex-shrink-0`}
          >
            {r.name.charAt(0)}
          </div>

          {/* Name, Stars, and Review (aligned vertically) */}
          <div className="flex flex-col">
            <div className="text-base font-semibold text-gray-900">{r.name}</div>
            <div className="flex items-center text-yellow-400 mb-2">
              <Star className="w-4 h-4 fill-yellow-400" />
              <Star className="w-4 h-4 fill-yellow-400" />
              <Star className="w-4 h-4 fill-yellow-400" />
              <Star className="w-4 h-4 fill-yellow-400" />
              <Star className="w-4 h-4 fill-yellow-400/70" />
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">{r.text}</p>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>



        {/* Cost comparison note (placed above heading) */}
        <div className="text-center mt-6 mb-4">
          <div className="inline-block bg-yellow-50 text-yellow-900 border border-yellow-200 px-4 py-2 rounded-md text-sm">
            Therapy costs $200+/hr. This only costs $19.99.
          </div>
        </div>
        <h2 className="text-center text-lg font-semibold text-gray-900 mb-3">Choose your plan</h2>
        <div className="space-y-4">
          {loadingPlans && (
            <div className="text-center text-sm text-gray-500">Loading plans…</div>
          )}
          {!loadingPlans && planCards.map((p) => {
            const isSelected = selectedPlan === p.id;
            return (
              <div
                key={p.id}
                onClick={() => setSelectedPlan(p.id)}
                className={`relative w-full cursor-pointer transition-all duration-300 ease-out`}
              >
                {/* Glow */}
                <div className={`absolute inset-0 rounded-2xl blur-xl opacity-60 ${isSelected ? 'opacity-80' : 'opacity-50'} bg-gradient-to-r ${p.gradient}`} aria-hidden="true"></div>

                {/* Card */}
                <div className={`relative rounded-2xl bg-white/80 border border-white/60 backdrop-blur-sm p-5 sm:p-6 shadow-sm hover:shadow-lg`}
                  style={{
                    boxShadow: isSelected
                      ? '0 10px 30px rgba(0,0,0,0.08), 0 0 0 2px rgba(0,0,0,0.02)'
                      : '0 6px 18px rgba(0,0,0,0.05)'
                  }}
                >
                  {/* Badge */}
                  {p.badge && (
                    <div className="absolute -top-3 left-4">
                      <div className="bg-gray-900 text-white px-3 py-1 text-[10px] font-semibold rounded-md shadow">
                        {p.badge}
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
                    <div className="min-w-0">
                      <div className="text-xs text-gray-600">{p.sub}</div>
                      <h3 className="text-[17px] sm:text-[19px] font-semibold text-gray-900 leading-snug">{p.name}</h3>
                      {/* Price lines to mirror screenshot layout */}
                      {(p.monthly || p.billed) && (
                        <div className="mt-1">
                          {p.monthly && (
                            <div className="text-[17px] sm:text-[19px] text-gray-900 font-semibold">{p.monthly}</div>
                          )}
                          {p.billed && (
                            <div className="text-xs text-gray-600">{p.billed}</div>
                          )}
                        </div>
                      )}
                      {p.helper && (
                        <div className="text-xs text-gray-600 mt-1">{p.helper}</div>
                      )}
                    </div>

                    <div className="w-[150px] justify-self-end self-start">
                      <button
                        className={`w-full px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                          isSelected
                            ? 'bg-gray-900 text-white'
                            : 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {isSelected ? 'Selected' : 'Choose Plan'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* CTA moved above guarantee */}
      <motion.div
        className="text-center instant-plan-cta"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.9 }}
      >
        <button
          onClick={startCheckout}
          disabled={creatingCheckout || loadingPlans}
          className={`w-full bg-gray-900 text-white py-4 px-8 rounded-full text-base font-semibold hover:opacity-90 transition-all duration-200 ${creatingCheckout || loadingPlans ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
          {creatingCheckout
            ? 'Redirecting…'
            : selectedPlan === 'IND_3M'
              ? 'Start My Transformation'
              : selectedPlan === 'IND_6M'
                ? 'Start My Deep Dive'
                : 'Start My Journey'}
        </button>
        <p className="text-[11px] text-gray-600 mt-3 leading-relaxed">
          {getPlanDisclaimer(selectedPlan)}
        </p>
      </motion.div>

      {/* Guarantee now below CTA */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.0 }}
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-xl">🛡️</span>
          <span className="text-green-600 font-semibold text-sm">End-to-end encrypted</span>
        </div>
      </motion.div>

      {/* FAQ redesigned to resemble reference screenshot (static expanded list) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.1 }}
        className="bg-white   border-gray-200  p-6 md:p-7 space-y-6"
      >
        <h3 className="text-center text-lg font-semibold text-gray-900 mb-2">People often ask</h3>
        <div className="space-y-6">
          {[
            {
              q: 'How quickly will I see results?',
              a: 'Most users notice small wins in the first week, with measurable improvements over 2–4 weeks when following daily steps.'
            },
            {
              q: 'Can I cancel anytime?',
              a: 'Yes, you can cancel anytime from your account settings. Your access continues through the current billing period.'
            },
            {
              q: 'What happens after the initial period?',
              a: 'After your introductory plan period, billing continues at the standard monthly rate with the flexibility to cancel whenever you like.'
            },
            {
              q: 'Do I need a lot of time each day?',
              a: 'No. The plan adapts to your time budget with short, realistic daily steps designed to build consistency.'
            },
            {
              q: 'Is this a replacement for therapy?',
              a: 'No. It is a supportive companion that provides structure, accountability and evidence‑informed techniques between or alongside professional care.'
            }
          ].map((item, idx) => (
            <div key={idx} className="flex items-start gap-4">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#0d5d52]/10 text-[#0d5d52] font-semibold text-xs flex items-center justify-center mt-1">
                {idx + 1}
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-gray-900 mb-1 leading-snug">{item.q}</h4>
                <p className="text-sm text-gray-600 leading-relaxed">{item.a}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default InstantPlanPreviewStep;



