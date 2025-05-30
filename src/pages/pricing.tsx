import Layout from '../components/layout/Layout';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import CTA from '../components/sections/CTA';

export default function PricingPage() {
  const pricingPlans = [
    {
      name: "Basic Magic",
      price: 49.99,
      description: "Your personalized storybook with beautiful illustrations",
      features: [
        "17-page personalized storybook",
        "High-quality printing",
        "Beautiful custom illustrations",
        "Up to 5 character photos",
        "Personal message on first page",
        "Standard shipping (12-15 business days after proof approval)"
      ],
      popular: false,
      buttonText: "Choose Basic Magic"
    },
    {
      name: "Premium Adventure",
      price: 59.99,
      description: "Physical book + digital eBook for reading anywhere",
      features: [
        "17-page personalized storybook",
        "Premium hardcover binding",
        "Beautiful custom illustrations",
        "Up to 10 character photos",
        "Personal message on first page",
        "Digital eBook included",
        "Standard shipping (12-15 business days after proof approval)"
      ],
      popular: true,
      buttonText: "Choose Premium Adventure"
    },
    {
      name: "Deluxe Kingdom",
      price: 89.99,
      description: "Premium features with coloring pages and expedited shipping",
      features: [
        "17-page personalized storybook",
        "Deluxe hardcover with special binding",
        "Beautiful custom illustrations",
        "Unlimited character photos",
        "Personal message on first page",
        "Digital eBook included",
        "Coloring pages featuring your characters",
        "Expedited shipping (8-11 business days after proof approval)"
      ],
      popular: false,
      buttonText: "Choose Deluxe Kingdom"
    }
  ];

  const addOns = [
    {
      name: "25-Page Story",
      price: 15.00,
      description: "Extend your story to 25 pages for a longer adventure."
    },
    {
      name: "30-Page Story",
      price: 30.00,
      description: "Maximum length story with 30 pages of magical adventure."
    },
    {
      name: "Extra Copies",
      price: 19.99,
      description: "Additional copies of the same book at a discounted price."
    },
    {
      name: "Expedited Shipping",
      price: 15.00,
      description: "Faster shipping: 8-11 business days after proof approval (instead of 12-15)."
    },
    {
      name: "Priority Shipping",
      price: 30.00,
      description: "Fastest shipping: 5-8 business days after proof approval (instead of 12-15)."
    }
  ];

  return (
    <Layout title="Pricing | CustomHereos - Personalized Storybooks">
      <div className="pt-10">
        <div className="container mx-auto px-4 py-12">
          <h1 className="font-montserrat font-bold text-4xl md:text-5xl text-center mb-8 text-inkwell-black">
            Pricing Plans
          </h1>
          <p className="text-lg text-center text-charcoal max-w-3xl mx-auto mb-16">
            Choose the perfect package for your personalized storybook. All plans include our custom AI story generation and professional design.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {pricingPlans.map((plan, index) => (
              <Card 
                key={index} 
                className={`h-full flex flex-col ${plan.popular ? 'border-2 border-tale-purple relative' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute top-0 inset-x-0 transform -translate-y-1/2 flex justify-center">
                    <span className="bg-tale-purple text-white text-sm font-bold py-1 px-4 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="font-montserrat font-bold text-2xl text-inkwell-black mb-2 text-center">
                    {plan.name}
                  </h3>
                  <div className="text-center mb-4">
                    <span className="text-4xl font-bold text-inkwell-black">${plan.price}</span>
                    <span className="text-charcoal"> / book</span>
                  </div>
                  <p className="text-center text-charcoal mb-6">
                    {plan.description}
                  </p>
                  <ul className="mb-8 flex-1">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start mb-3">
                        <span className="text-tale-purple mr-2">✓</span>
                        <span className="text-charcoal">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="text-center mt-auto">
                    <Button 
                      href="/create" 
                      variant={plan.popular ? "primary" : "secondary"}
                      className="w-full"
                    >
                      {plan.buttonText}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          
          <div className="bg-fog rounded-lg p-8 mb-16">
            <h2 className="font-montserrat font-bold text-2xl md:text-3xl text-center mb-8 text-inkwell-black">
              Optional Add-Ons
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {addOns.map((addon, index) => (
                <div key={index} className="bg-white rounded-lg p-5 shadow-level-1">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-montserrat font-semibold text-lg text-inkwell-black">
                      {addon.name}
                    </h3>
                    <span className="font-bold text-tale-purple">
                      ${addon.price}
                    </span>
                  </div>
                  <p className="text-sm text-charcoal">
                    {addon.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-paper-white rounded-lg p-8 shadow-level-1 max-w-3xl mx-auto">
            <h2 className="font-montserrat font-bold text-2xl text-center mb-6 text-inkwell-black">
              Bulk Ordering
            </h2>
            <p className="text-center text-charcoal mb-6">
              Looking to order multiple books for a classroom, family reunion, or special event? 
              We offer special discounts for bulk orders of 10 or more books.
            </p>
            <div className="text-center">
              <Button href="/contact" variant="secondary">
                Contact for Bulk Pricing
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <CTA />
    </Layout>
  );
}
