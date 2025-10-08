// FAQ Data for SEO and Schema Markup
export const faqData = [
  {
    question: "What is Noyco?",
    answer: "Noyco is an AI-powered mental health platform that provides 24/7 emotional support and therapy through specialized AI agents. Our platform offers instant access to personalized mental wellness support for anxiety, depression, loneliness, and general emotional well-being."
  },
  {
    question: "How does AI therapy work?",
    answer: "Our AI therapy uses advanced natural language processing and machine learning to understand your emotions and provide empathetic, personalized responses. Each AI agent is trained in specific mental health areas like anxiety management, depression support, and wellness coaching, ensuring you receive expert guidance tailored to your needs."
  },
  {
    question: "Is my data private and secure?",
    answer: "Yes, absolutely. We use military-grade encryption to protect all your conversations and personal data. Your information is completely confidential and we comply with healthcare privacy standards including HIPAA. We never share your data with third parties without your explicit consent."
  },
  {
    question: "How much does Noyco cost?",
    answer: "Noyco offers flexible pricing plans to make mental health support accessible to everyone. We have a free tier with basic features, and premium plans starting at $29/month with unlimited sessions, specialized AI agents, and advanced features. Check our pricing page for detailed information."
  },
  {
    question: "Can AI therapy replace human therapists?",
    answer: "AI therapy is designed to complement, not replace, human therapists. Our platform provides immediate support and coping strategies, making mental health care more accessible. However, for severe mental health conditions or crisis situations, we always recommend consulting with licensed mental health professionals."
  },
  {
    question: "What mental health issues can Noyco help with?",
    answer: "Noyco can help with various mental health concerns including anxiety, depression, stress management, loneliness, emotional regulation, and general wellness. Our specialized AI agents are trained to provide support for these specific areas, offering coping strategies, mindfulness techniques, and personalized guidance."
  },
  {
    question: "Is Noyco available 24/7?",
    answer: "Yes! One of the key benefits of AI-powered therapy is that support is available whenever you need it. Whether it's 3 AM or during a stressful moment at work, you can access Noyco's AI agents anytime, anywhere."
  },
  {
    question: "How do I get started with Noyco?",
    answer: "Getting started is simple: 1) Create your free account, 2) Complete a brief assessment about your mental health goals, 3) Get matched with specialized AI agents, and 4) Start your first session. The entire process takes less than 5 minutes."
  },
  {
    question: "Can I use both text and voice with Noyco?",
    answer: "Yes, Noyco supports both text-based chat and voice conversations. You can choose the communication method that feels most comfortable for you. Voice sessions use advanced speech recognition and natural language understanding to provide the same empathetic support as text conversations."
  },
  {
    question: "What makes Noyco different from other mental health apps?",
    answer: "Noyco stands out with its specialized AI agents trained for specific mental health areas, 24/7 availability, unlimited sessions, complete privacy, and adaptive learning that personalizes support based on your unique needs. We combine cutting-edge AI technology with evidence-based therapeutic approaches."
  },
  {
    question: "Is there a free trial?",
    answer: "Yes, we offer a free tier that allows you to experience Noyco's AI therapy capabilities. You can upgrade to a premium plan anytime for unlimited sessions and access to all specialized AI agents."
  },
  {
    question: "What age do I need to be to use Noyco?",
    answer: "You must be at least 18 years old to create a Noyco account. For users under 18, we recommend seeking support from licensed professionals or platforms specifically designed for younger age groups."
  },
];

// Generate FAQ schema for structured data
export function generateFAQSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqData.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
}

// FAQ Component
export function FAQSection({ className = "" }) {
  return (
    <section className={`faq-section ${className}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
          Frequently Asked Questions
        </h2>
        
        <div className="space-y-8">
          {faqData.map((faq, index) => (
            <div key={index} className="border-b border-gray-200 pb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {faq.question}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
