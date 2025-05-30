import Layout from '../components/layout/Layout';

export default function PrivacyPolicyPage() {
  return (
    <Layout title="Privacy Policy | CustomHeroes - Personalized Storybooks">
      <div className="pt-20 bg-gradient-to-b from-fog/30 to-white">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <h1 className="font-montserrat font-bold text-4xl md:text-5xl text-center mb-6 text-inkwell-black">
            Privacy Policy
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-tale-purple to-story-blue mx-auto mb-8"></div>
          <p className="text-lg text-center text-charcoal max-w-3xl mx-auto mb-12">
            At CustomHeroes, we take your privacy seriously. This policy outlines how we collect, use, and protect your information.
          </p>
          
          <div className="prose prose-lg max-w-none">
            <div className="mb-10">
              <h2 className="font-montserrat font-bold text-2xl text-inkwell-black mb-4">Last Updated: May 26, 2025</h2>
              <p>
                This Privacy Policy describes how CustomHeroes ("we", "us", or "our") collects, uses, and discloses your 
                personal information when you visit our website, create personalized books, or engage with our services.
              </p>
            </div>

            <div className="mb-10">
              <h2 className="font-montserrat font-bold text-2xl text-inkwell-black mb-4">Information We Collect</h2>
              <p>We collect several types of information for various purposes:</p>
              <h3 className="font-montserrat font-semibold text-xl text-inkwell-black mt-6 mb-3">Personal Information</h3>
              <p>When you create an account or place an order, we collect:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Name and contact information (email address, shipping address)</li>
                <li>Payment information (processed securely through our payment providers)</li>
                <li>Account credentials</li>
              </ul>
              
              <h3 className="font-montserrat font-semibold text-xl text-inkwell-black mt-6 mb-3">Book Creation Information</h3>
              <p>To create your personalized books, we collect:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Photos you upload of your child or other individuals</li>
                <li>Names, ages, and other details you provide about the book's characters</li>
                <li>Preferences regarding story themes, character traits, and other customization options</li>
              </ul>
              
              <h3 className="font-montserrat font-semibold text-xl text-inkwell-black mt-6 mb-3">Usage Information</h3>
              <p>We automatically collect certain information when you visit our website:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>IP address and device information</li>
                <li>Browser type and settings</li>
                <li>How you interact with our website (pages visited, time spent)</li>
                <li>Referral source</li>
              </ul>
            </div>

            <div className="mb-10">
              <h2 className="font-montserrat font-bold text-2xl text-inkwell-black mb-4">How We Use Your Information</h2>
              <p>We use your information for the following purposes:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>To create and deliver your personalized books</li>
                <li>To process payments and fulfill orders</li>
                <li>To communicate with you about your orders and account</li>
                <li>To improve our website and services</li>
                <li>To provide customer support</li>
                <li>To send you marketing communications (with your consent)</li>
                <li>To comply with legal obligations</li>
              </ul>
            </div>

            <div className="mb-10">
              <h2 className="font-montserrat font-bold text-2xl text-inkwell-black mb-4">How We Protect Children's Privacy</h2>
              <p>
                We understand the importance of protecting children's privacy. Our services are directed at adults who 
                want to create personalized books for children. We do not knowingly collect personal information from 
                children under 13. If you believe we have inadvertently collected information from a child under 13, 
                please contact us immediately.
              </p>
              <p className="mt-4">
                The photos and information you provide about children are used solely for the purpose of creating 
                personalized books and are handled with the utmost care and security.
              </p>
            </div>

            <div className="mb-10">
              <h2 className="font-montserrat font-bold text-2xl text-inkwell-black mb-4">Data Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your personal information. 
                However, no method of transmission over the Internet or electronic storage is 100% secure. While we 
                strive to use commercially acceptable means to protect your personal information, we cannot guarantee 
                its absolute security.
              </p>
            </div>

            <div className="mb-10">
              <h2 className="font-montserrat font-bold text-2xl text-inkwell-black mb-4">Sharing Your Information</h2>
              <p>We may share your information with:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Service providers who help us operate our business (payment processors, shipping companies, cloud storage providers)</li>
                <li>Professional advisors (lawyers, accountants, insurers)</li>
                <li>Government bodies when required by law</li>
              </ul>
              <p>
                We do not sell your personal information or the photos you upload to third parties for marketing purposes.
              </p>
            </div>

            <div className="mb-10">
              <h2 className="font-montserrat font-bold text-2xl text-inkwell-black mb-4">Your Rights</h2>
              <p>Depending on your location, you may have the following rights:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Access to your personal information</li>
                <li>Correction of inaccurate information</li>
                <li>Deletion of your information</li>
                <li>Restriction or objection to processing</li>
                <li>Data portability</li>
                <li>Withdrawal of consent</li>
              </ul>
              <p>
                To exercise these rights, please contact us using the information provided at the end of this policy.
              </p>
            </div>

            <div className="mb-10">
              <h2 className="font-montserrat font-bold text-2xl text-inkwell-black mb-4">Cookies and Tracking Technologies</h2>
              <p>
                We use cookies and similar tracking technologies to track activity on our website and hold certain information. 
                Cookies are files with a small amount of data that may include an anonymous unique identifier. You can instruct 
                your browser to refuse all cookies or to indicate when a cookie is being sent.
              </p>
            </div>

            <div className="mb-10">
              <h2 className="font-montserrat font-bold text-2xl text-inkwell-black mb-4">Changes to This Privacy Policy</h2>
              <p>
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new 
                Privacy Policy on this page and updating the "Last Updated" date. You are advised to review this Privacy 
                Policy periodically for any changes.
              </p>
            </div>

            <div className="mb-10">
              <h2 className="font-montserrat font-bold text-2xl text-inkwell-black mb-4">Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us:
              </p>
              <ul className="list-none pl-0 mt-4">
                <li className="mb-2"><strong>Email:</strong> privacy@customheroes.com</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
