"use client";

import { MarketingFunnelProvider } from './context/MarketingFunnelContext';
import MarketingFunnelFlow from './components/MarketingFunnelFlow';
import './styles.css';

export default function MarketingFunnelPage() {
  return (
    <div className="getting-started-root relative bg-white font-mier">
      <MarketingFunnelProvider>
        <MarketingFunnelFlow />
      </MarketingFunnelProvider>
    </div>
  );
}
