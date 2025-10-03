"use client"

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useMarketingFunnel } from '../../context/MarketingFunnelContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Target, Clock, Zap, Smartphone, Heart, BookOpen } from 'lucide-react';
import { apiRequest } from '@/lib/api';
import { getStripe } from '@/stripe/utils/stripeLoader';

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
      const payload = { email, plan_code: selectedPlan };
      const { sessionId } = await apiRequest('/public/billing/checkout-session', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      const stripe = await getStripe();
      const { error } = await stripe.redirectToCheckout({ sessionId });
      if (error) {
        console.error('Stripe redirect error', error);
        alert(error.message || 'Unable to redirect to checkout');
      }
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

  const planCards = plans.map((p) => ({
    id: p.code,
    title: `${p.months}-MONTH PLAN`,
    priceDisplay: p.priceDisplay || '',
    // Only show 'MOST POPULAR' and remove 'BEST VALUE'
    badge: p.code === 'IND_1M' ? 'MOST POPULAR' : null,
  }));
  
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
  

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
     
      {/* Header */}
      <motion.div
        className="text-center space-y-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
      >
        <h1 className="text-2xl font-bold text-gray-900">
          {getUserName()}, here’s a snapshot of your
          <br />
          <span className="text-gray-600">personalized plan</span>
        </h1>
        <p className="text-sm text-gray-500">Tailored from your selections in the flow</p>
      </motion.div>

      

      {/* Before/After images (sad -> happy) */}
      <motion.div
        className="flex justify-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
      >
        <div className="grid grid-cols-2 gap-6 items-center">
          {/* Before - Sad */}
          <div className="text-center">
            <div className="relative w-[270px] h-[250px]  bg-white">
            
                  <Image
                 src="/sad.png"
                 alt="Before - feeling better"
                objectFit='contain'
                height={300}
                width={300}
                priority={true}
                />
            </div>
            <div className="mt-20 text-lg font-medium text-gray-500">Before</div>
          </div>

          {/* After - Happy */}
          <div className="text-center">
            <div className="relative w-[270px] h-[250px] bg-white">
              <Image src="/happy.png" 
              alt="After - feeling better" 
              objectFit="contain"
              height={300}
              width={300}
              priority={true}
               />
            </div>
            <div className="mt-20 text-lg font-medium text-gray-500">After</div>
          </div>
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
        {/* Cost comparison note (placed above heading) */}
        <div className="text-center mb-2">
          <div className="inline-block bg-yellow-50 text-yellow-900 border border-yellow-200 px-4 py-2 rounded-md text-sm">
            Therapy costs $200+/hr. This only costs $19.99.
          </div>
        </div>
        <h2 className="text-center text-lg font-semibold text-gray-900 mb-3">Choose your plan</h2>
        <div className="space-y-4">
          {loadingPlans && (
            <div className="text-center text-sm text-gray-500">Loading plans…</div>
          )}
          {!loadingPlans && planCards.map((p) => (
            <div
              key={p.id}
              onClick={() => setSelectedPlan(p.id)}
              className={`relative bg-white border-2 rounded-none p-5 cursor-pointer w-full transition-all duration-200 ${
                selectedPlan === p.id ? 'border-gray-900 shadow-sm' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {p.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <div className="bg-gray-900 text-white px-3 py-1 text-[10px] font-semibold rounded-b-md shadow">
                    {p.badge}
                  </div>
                </div>
              )}
              <div className="flex items-center justify-between gap-6 flex-wrap">
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{p.title}</h3>
                  {p.priceDisplay && (
                    <div className="flex items-baseline gap-2">
                      <div className="text-xl text-gray-900">{p.priceDisplay}</div>
                    </div>
                  )}
                </div>
                <div className="min-w-[160px]">
                  <button className="w-full bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] text-gray-800 px-4 py-2 rounded-none hover:shadow-lg transition-all duration-200 text-sm font-semibold">
                    {selectedPlan === p.id ? 'Selected' : 'Choose plan'}
                  </button>
                </div>
              </div>
              
            </div>
          ))}
        </div>
      </motion.div>

      {/* Guarantee */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.85 }}
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-xl">🛡️</span>
          <span className="text-green-600 font-semibold text-sm">End-to-end encrypted</span>
        </div>
      </motion.div>

      {/* FAQ */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.95 }}
        className="bg-white border border-gray-200 rounded-lg p-5"
      >
        <h3 className="text-base font-semibold text-gray-900 mb-3 text-center">Frequently asked questions</h3>
        <div className="space-y-2">
          {[
            { q: 'How quickly will I see results?', a: 'Most users notice small wins in the first week, with measurable improvements over 2–4 weeks when following daily steps.' },
            { q: 'Can I cancel anytime?', a: 'Yes, you can cancel anytime from your account. No questions asked.' },
            { q: 'What if my situation changes?', a: 'Your plan adapts. Update preferences anytime and your daily steps will adjust automatically.' },
            { q: 'Do I need a lot of time?', a: 'No. The plan fits your time budget with micro‑steps you can do in minutes.' }
          ].map((item, i) => (
            <details key={i} className="border border-gray-100 rounded-md p-3">
              <summary className="cursor-pointer list-none font-medium text-gray-800 flex items-center justify-between">
                <span>{item.q}</span>
                <span className="text-gray-400">+</span>
              </summary>
              <p className="text-sm text-gray-600 mt-2">{item.a}</p>
            </details>
          ))}
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.05 }}
      >
        <button
          onClick={startCheckout}
          disabled={creatingCheckout || loadingPlans}
          className={`w-full bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] text-gray-800 py-4 px-8 rounded-none text-base font-semibold hover:shadow-lg transition-all duration-200 ${creatingCheckout || loadingPlans ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
          {creatingCheckout ? 'Redirecting…' : `Start my plan`}
        </button>
        <p className="text-xs text-gray-500 mt-3">
          By continuing, you agree to automatic renewal. Cancel anytime.
        </p>
      </motion.div>
    </div>
  );
};

export default InstantPlanPreviewStep;



