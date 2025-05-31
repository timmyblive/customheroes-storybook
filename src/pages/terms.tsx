import Layout from '../components/layout/Layout';

export default function TermsOfServicePage() {
  return (
    <Layout title="Terms of Service | CustomHeroes - Personalized Storybooks">
      <div className="pt-20 bg-gradient-to-b from-fog/30 to-white">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <h1 className="font-montserrat font-bold text-4xl md:text-5xl text-center mb-6 text-inkwell-black">
            Terms of Service
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-tale-purple to-story-blue mx-auto mb-8"></div>
          <p className="text-lg text-center text-charcoal max-w-3xl mx-auto mb-12">
            Please read these terms carefully before using our services.
          </p>
          
          <div className="prose prose-lg max-w-none">
            <div className="mb-10">
              <h2 className="font-montserrat font-bold text-2xl text-inkwell-black mb-4">Last Updated: May 26, 2025</h2>
              <p>
                These Terms of Service ("Terms") govern your access to and use of the CustomHeroes website and services.
                By accessing or using our services, you agree to be bound by these Terms.
              </p>
            </div>

            <div className="mb-10">
              <h2 className="font-montserrat font-bold text-2xl text-inkwell-black mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing or using our website and services, you agree to be bound by these Terms and our Privacy Policy.
                If you do not agree to these Terms, please do not use our services.
              </p>
            </div>

            <div className="mb-10">
              <h2 className="font-montserrat font-bold text-2xl text-inkwell-black mb-4">2. Account Registration</h2>
              <p>
                To use certain features of our services, you may need to create an account. You are responsible for:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Providing accurate and complete information</li>
                <li>Maintaining the security of your account credentials</li>
                <li>All activities that occur under your account</li>
              </ul>
              <p>
                We reserve the right to suspend or terminate accounts that violate these Terms or for any other reason at our discretion.
              </p>
            </div>

            <div className="mb-10">
              <h2 className="font-montserrat font-bold text-2xl text-inkwell-black mb-4">3. Ordering and Payment</h2>
              <p>
                When you place an order for a personalized book, you agree to provide accurate payment information and authorize us to charge your payment method for the total amount of your order.
              </p>
              <p className="mt-3">
                All prices are subject to change without notice. We reserve the right to refuse or cancel any order for any reason, including errors in pricing or availability.
              </p>
            </div>

            <div className="mb-10">
              <h2 className="font-montserrat font-bold text-2xl text-inkwell-black mb-4">4. User Content</h2>
              <p>
                When you upload photos or provide information for your personalized book, you:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Retain ownership of your content</li>
                <li>Grant us a license to use, reproduce, modify, and display your content solely for the purpose of providing our services to you</li>
                <li>Represent that you have all necessary rights to the content and that it does not infringe on any third-party rights</li>
              </ul>
              <p>
                We reserve the right to refuse or remove any content that violates these Terms or that we find objectionable.
              </p>
            </div>

            <div className="mb-10">
              <h2 className="font-montserrat font-bold text-2xl text-inkwell-black mb-4">5. Intellectual Property</h2>
              <p>
                All content on our website, including text, graphics, logos, images, and software, is the property of CustomHeroes or our licensors and is protected by copyright, trademark, and other intellectual property laws.
              </p>
              <p className="mt-3">
                You may not use, reproduce, distribute, or create derivative works based on our content without our express written permission.
              </p>
            </div>

            <div className="mb-10">
              <h2 className="font-montserrat font-bold text-2xl text-inkwell-black mb-4">6. Personalized Books</h2>
              <p>
                Each personalized book is created specifically for you based on the information and photos you provide. Due to the personalized nature of our products:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>We cannot accept returns unless there is a printing defect or damage during shipping</li>
                <li>You will have the opportunity to review a digital proof before your book is printed</li>
                <li>We reserve the right to make minor adjustments to ensure quality</li>
              </ul>
            </div>

            <div className="mb-10">
              <h2 className="font-montserrat font-bold text-2xl text-inkwell-black mb-4">7. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, CustomHeroes shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of our services.
              </p>
              <p className="mt-3">
                Our total liability for any claims arising under these Terms shall not exceed the amount you paid for the product or service that is the subject of the claim.
              </p>
            </div>

            <div className="mb-10">
              <h2 className="font-montserrat font-bold text-2xl text-inkwell-black mb-4">8. Indemnification</h2>
              <p>
                You agree to indemnify and hold harmless CustomHeroes and its officers, directors, employees, and agents from any claims, damages, liabilities, costs, or expenses arising out of your use of our services, your violation of these Terms, or your violation of any rights of a third party.
              </p>
            </div>

            <div className="mb-10">
              <h2 className="font-montserrat font-bold text-2xl text-inkwell-black mb-4">9. Governing Law</h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of the state of [State], without regard to its conflict of law provisions.
              </p>
            </div>

            <div className="mb-10">
              <h2 className="font-montserrat font-bold text-2xl text-inkwell-black mb-4">10. Changes to Terms</h2>
              <p>
                We reserve the right to modify these Terms at any time. We will provide notice of significant changes by posting the updated Terms on our website and updating the "Last Updated" date. Your continued use of our services after such changes constitutes your acceptance of the new Terms.
              </p>
            </div>

            <div className="mb-10">
              <h2 className="font-montserrat font-bold text-2xl text-inkwell-black mb-4">11. Contact Us</h2>
              <p>
                If you have any questions about these Terms, please contact us:
              </p>
              <ul className="list-none pl-0 mt-4">
                <li className="mb-2"><strong>Email:</strong> legal@customheroes.ai</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
