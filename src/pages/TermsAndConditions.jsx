import React from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import TopNav from "../components/TopNav";
import BackButton from "../components/BackButton";
import FullscreenMenu from "./FullscreenMenu";

export default function TermsAndConditions() {
  const [isFullMenuOpen, setFullMenuOpen] = React.useState(false);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Fixed Background */}
      <div 
        className="fixed inset-0 bg-cover bg-center"
        style={{ 
          backgroundImage: "url('/Personalized.jpeg')"
        }}
      />
      
      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/80 to-transparent z-0" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-black/60 z-0" />

      {/* Hamburger Menu */}
      <FullscreenMenu isOpen={isFullMenuOpen} setIsOpen={setFullMenuOpen} />

      {/* Back Button */}
      <BackButton variant="glass" />

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Navbar */}
        <TopNav active="terms" />
        
        {/* Hero Section */}
        <section className="relative mt-8 px-8">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <div className="mb-8 mt-24 flex justify-center">
              <Link to="/">
                <button className="group flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 shadow-2xl hover:shadow-emerald-500/25 hover:scale-105">
                  <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Home
                </button>
              </Link>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-amber-200 via-yellow-300 to-orange-400 bg-clip-text text-transparent drop-shadow-2xl">
              TERMS AND CONDITIONS
            </h1>
            
            <div className="w-32 h-1 bg-gradient-to-r from-amber-400 to-orange-500 mx-auto mb-8 rounded-full" />
          </div>
        </section>

        {/* Content Section */}
        <section className="px-8 pb-20">
          <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 p-8 md:p-12">
            <div className="text-white/90 space-y-6 leading-relaxed">
              
              <div>
                <h2 className="text-2xl font-bold text-amber-300 mb-4">PRELIMINARY CONSIDERATIONS</h2>
                <p>
                  By using this website and accessing any product or service among those supplied and/or proposed through the website itself, the user accepts the clauses that make up the following conditions and which, jointly, form the "Terms and Conditions of Use". Any agreement that should be formed through the booking of any service among the products offered, therefore, will be regulated by the aforementioned conditions that the user, navigating on the site and ordering any of the services offered, declares to have read and accepted.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-amber-300 mb-4">SCOPE OF APPLICATION</h2>
                <p>
                  The present website has been created to provide interested users useful resources to organize and best experience a stay in the City of Rome. Services offered cover every detail from arrival in the City (at the Airport or the Railway Stations of Roma Termini and Roma Tiburtina), with booking services for:
                </p>
                <ul className="list-disc list-inside mt-3 space-y-2 ml-4">
                  <li>Restaurants, beauty centers, spas</li>
                  <li>Transport with driver, itineraries, and guided tours (including personalized ones)</li>
                  <li>Golf car, Vespa, or sidecar services</li>
                  <li>Babysitters and pet sitters</li>
                  <li>Tours to the most important attractions of the Eternal City</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-amber-300 mb-4">1. GENERAL INFORMATION AND IDENTIFICATION OF THE PROFESSIONAL</h2>
                
                <h3 className="text-xl font-semibold text-emerald-300 mt-4 mb-2">1.1 Identification of the Manager</h3>
                <p>
                  The present website is managed by ETERNAL CITY Enterprises Srls with registered office in Rome, Via Leccosa n. 54.
                </p>
                <ul className="list-disc list-inside mt-3 space-y-1 ml-4">
                  <li>CF/P.IVA: 18285501005</li>
                  <li>Tel: +393518741550</li>
                  <li>Email: info@myguideinrome.com</li>
                  <li>PEC: Eternalcity@legalmail.it</li>
                </ul>

                <h3 className="text-xl font-semibold text-emerald-300 mt-6 mb-2">1.2 Nature of the Services</h3>
                <p>The site offers two distinct types of tourist services:</p>
                <ul className="list-disc list-inside mt-3 space-y-2 ml-4">
                  <li><strong>a) Services directly organized by the manager:</strong> These include the creation of itineraries, guided walking or cycling tours (including personalized options), and bookings at restaurants, rooftops, bars, lounges, and trendy venues.</li>
                  <li><strong>b) Intermediation services for services provided by third parties:</strong> These include services like beauty sessions/aesthetic treatments (nails, lashes, etc.), spa access, chauffeur services (luxury cars, golf car Vespa/sidecar), car/motorbike rental without driver, private guided tours of the Vatican Museums/Sistine Chapel and famous places of worship in Rome, and babysitter/pet sitter service.</li>
                </ul>

                <h3 className="text-xl font-semibold text-emerald-300 mt-6 mb-2">1.3 Legal Qualification</h3>
                <p>In conformity with art. 33 of the Tourism Code, the manager operates alternatively as:</p>
                <ul className="list-disc list-inside mt-3 space-y-1 ml-4">
                  <li>Organizer of tourist services for the services directly provided.</li>
                  <li>Intermediary for services provided by third-party suppliers.</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-amber-300 mb-4">2. INFORMATION OBLIGATIONS AND TRANSPARENCY</h2>
                <p>
                  In conformity with articles 49 and 49-bis of the Consumer Code, once the booking has been executed, the user will receive clear and comprehensible information on:
                </p>
                <ul className="list-disc list-inside mt-3 space-y-1 ml-4">
                  <li>Main characteristics of the services offered</li>
                  <li>Identity of the effective supplier of the service</li>
                  <li>Total price inclusive of taxes and additional costs</li>
                  <li>Methods of payment, delivery, and execution</li>
                  <li>Conditions of withdrawal where applicable</li>
                  <li>Existence and conditions of guarantees and after-sales assistance</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-amber-300 mb-4">3. SERVICES DIRECTLY ORGANIZED</h2>
                
                <h3 className="text-xl font-semibold text-emerald-300 mt-4 mb-2">3.1 Responsibility of the Manager</h3>
                <p>
                  For itinerary organization services (including restaurant reservations and tourist visits) directly organized, the manager assumes full responsibility for the execution according to what is foreseen by the Tourism Code.
                </p>

                <h3 className="text-xl font-semibold text-emerald-300 mt-6 mb-2">3.2 Obligations of Means</h3>
                <p>
                  The manager commits to the fulfillment of the services according to the qualified professional diligence required by the tourist activity, assuming the obligation to prepare the most adequate instruments for the provision of the requested service.
                </p>

                <h3 className="text-xl font-semibold text-emerald-300 mt-6 mb-2">3.3 Modifications and Cancellations</h3>
                <p>
                  These conditions are regulated in conformity with the provisions of the Tourism Code.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-amber-300 mb-4">4. INTERMEDIATION SERVICES</h2>
                
                <h3 className="text-xl font-semibold text-emerald-300 mt-4 mb-2">4.1 Role of Intermediary</h3>
                <p>
                  For services provided by third parties (beauty sessions, spas, chauffeur, private guided tours), the manager operates exclusively as an intermediary, facilitating contact between the user and the effective provider of the service.
                </p>

                <h3 className="text-xl font-semibold text-emerald-300 mt-6 mb-2">4.2 Limitation of Liability</h3>
                <p>
                  In conformity with art. 50 of the Tourism Code, the manager is responsible for the execution of the intermediation mandate with due diligence, but is not responsible for the non-fulfillment of the third-party supplier, unless they have not used due diligence in selecting the supplier.
                </p>

                <h3 className="text-xl font-semibold text-emerald-300 mt-6 mb-2">4.3 Identification of Third-Party Suppliers</h3>
                <p>For each third-party service, the following must be clearly indicated:</p>
                <ul className="list-disc list-inside mt-3 space-y-1 ml-4">
                  <li>Denomination and identifying data of the effective supplier</li>
                  <li>Methods for directly contacting the supplier</li>
                  <li>Division of responsibilities between intermediary and supplier</li>
                  <li>Specific contractual conditions of the third-party supplier</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-amber-300 mb-4">5. TOURIST PACKAGES AND LINKED SERVICES</h2>
                
                <h3 className="text-xl font-semibold text-emerald-300 mt-4 mb-2">5.1 Tourist Package</h3>
                <p>
                  If at least two tourist services are requested and organized as a single combination by the manager, it constitutes a tourist package. The contract is unitary, and the organizer (the manager) is responsible for the package, regardless of who executes the individual services.
                </p>

                <h3 className="text-xl font-semibold text-emerald-300 mt-6 mb-2">5.2 Linked Tourist Services</h3>
                <p>
                  If the user simultaneously books multiple services from the manager and/or commercially linked third parties, the manager's responsibility is limited to the sole services directly sold. It does not extend to the services provided by the commercial partners, even if the booking is simultaneous.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-amber-300 mb-4">6. PROTECTION OF PERSONAL DATA</h2>
                
                <h3 className="text-xl font-semibold text-emerald-300 mt-4 mb-2">6.1 Data Processing</h3>
                <p>
                  The processing of personal data takes place in conformity with EU Regulation 2016/679 (GDPR) and Legislative Decree 196/2003 as modified by Legislative Decree 101/2018.
                </p>

                <h3 className="text-xl font-semibold text-emerald-300 mt-6 mb-2">6.2 Purposes of Processing</h3>
                <p>The data are processed for:</p>
                <ul className="list-disc list-inside mt-3 space-y-1 ml-4">
                  <li>Execution of contracts for tourist services</li>
                  <li>Fulfillment of legal obligations</li>
                  <li>Management of reservations and customer assistance</li>
                  <li>Sending commercial communications with prior consent</li>
                </ul>

                <h3 className="text-xl font-semibold text-emerald-300 mt-6 mb-2">6.3 Rights of the Data Subject</h3>
                <p>
                  The user can exercise all the rights foreseen by the GDPR, including access, rectification, cancellation, portability, and opposition to processing. Navigation on the site is equivalent to tacit provision of consent to the processing of data and to customer profiling.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-amber-300 mb-4">7. PAYMENT METHODS AND SECURITY</h2>
                
                <h3 className="text-xl font-semibold text-emerald-300 mt-4 mb-2">7.1 Payment Instruments</h3>
                <p>
                  The main electronic payment instruments are accepted. Any price differences linked to the payment method are clearly indicated before the purchase.
                </p>

                <h3 className="text-xl font-semibold text-emerald-300 mt-6 mb-2">7.2 Security of Transactions</h3>
                <p>
                  The site uses SSL security protocols and certified payment systems (PCI-DSS). Transactions are operated through the NEXI, PayPal, and STRIPE platforms.
                </p>

                <h3 className="text-xl font-semibold text-emerald-300 mt-6 mb-2">7.3 Depositary Role for Payments</h3>
                <p>
                  For packages or linked services, the manager may act as the depositary of sums due, on their own behalf and/or on behalf of commercial partners. Once the sums are transferred to the third parties, the manager has no further responsibility for the execution of the third party's service or for the eventual restitution of the amount paid (except for rules in paragraph 8).
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-amber-300 mb-4">8. RIGHT OF WITHDRAWAL</h2>
                
                <h3 className="text-xl font-semibold text-emerald-300 mt-4 mb-2">8.1 Applicability</h3>
                <p>
                  The right of withdrawal applies according to the provisions of the Consumer Code, with specific exclusions for tourist services and limitations in these conditions.
                </p>

                <h3 className="text-xl font-semibold text-emerald-300 mt-6 mb-2">8.2 Methods of Exercise by the User</h3>
                <p>
                  To withdraw, the user must use the form or provide a specific declaration of withdrawal.
                </p>
                <ul className="list-disc list-inside mt-3 space-y-1 ml-4">
                  <li>Withdrawal communicated within 5 days of booking allows the user to obtain a full refund.</li>
                  <li>The right of withdrawal is excluded for services offered with a reduced/diminished tariff (promotional offer), pursuant to art. 41, comma 7, of the Tourism Code.</li>
                </ul>

                <h3 className="text-xl font-semibold text-emerald-300 mt-6 mb-2">8.3 Penalties Based on Timing</h3>
                <p>
                  The user accepts the following criteria for determining the reimbursement, acknowledging that organization costs increase closer to the event date:
                </p>
                <ul className="list-disc list-inside mt-3 space-y-1 ml-4">
                  <li>If withdrawal is received less than 20 days before the start of the service, the manager has the right to retain the entire quota paid at the time of booking to cover costs and expenses.</li>
                  <li>If the entire cost was paid at the time of booking, the reimbursement will be a maximum of 50% of the total, with the remaining 50% retained for costs and expenses.</li>
                </ul>

                <h3 className="text-xl font-semibold text-emerald-300 mt-6 mb-2">8.4 Non-Annulment/Non-Withdrawal</h3>
                <p>
                  If the booked services are not annulled or subject to a declaration of withdrawal, the user must pay the full cost of the services. The user will have no claim for the return of any down payments or deposits, for both directly provided or intermediated services, with the manager being exempt from all responsibility.
                </p>

                <h3 className="text-xl font-semibold text-emerald-300 mt-6 mb-2">8.5 Right to Full Refund for the User</h3>
                <p>The user has the right to a full refund in the following cases:</p>
                <ul className="list-disc list-inside mt-3 space-y-1 ml-4">
                  <li>The manager or partner significantly modifies the conditions and methods of execution of the services compared to those publicized.</li>
                  <li>Documented unavoidable and extraordinary circumstances occurred at the destination or its immediate vicinity, substantially impacting the package execution or transport.</li>
                  <li>Subsequent severe illness or death of the user or a direct family member (documented with adequate medical certifications).</li>
                </ul>

                <h3 className="text-xl font-semibold text-emerald-300 mt-6 mb-2">8.6 Methods of Exercise of Withdrawal by the Manager</h3>
                <p>The manager may withdraw without penalty if:</p>
                <ul className="list-disc list-inside mt-3 space-y-1 ml-4">
                  <li>The minimum number of participants foreseen in the proposal is not reached.</li>
                  <li>Unforeseeable, unavoidable, and/or extraordinary circumstances occur.</li>
                  <li>In these cases, the organizer will fully refund the sums paid, and the user renounces the right to any compensation.</li>
                </ul>

                <h3 className="text-xl font-semibold text-emerald-300 mt-6 mb-2">8.7 Non-Refundable Rates</h3>
                <p>
                  Rates advertised as discounted and non-refundable do not allow withdrawal, as per art. 41, comma 7, of the Tourism Code.
                </p>

                <h3 className="text-xl font-semibold text-emerald-300 mt-6 mb-2">8.8 Intermediated Services Refunds</h3>
                <p>
                  For intermediated services (not directly organized by the manager), the manager assumes no responsibility for payments. Any refund requests must be addressed directly to the third-party supplier.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-amber-300 mb-4">9. CUSTOMER ASSISTANCE AND COMPLAINTS</h2>
                
                <h3 className="text-xl font-semibold text-emerald-300 mt-4 mb-2">9.1 Customer Service</h3>
                <p>Assistance is available via:</p>
                <ul className="list-disc list-inside mt-3 space-y-1 ml-4">
                  <li>Telephone: +393518741550</li>
                  <li>Email: info@myguideinrome.com</li>
                  <li>PEC: Eternalcity@legalmail.it</li>
                </ul>

                <h3 className="text-xl font-semibold text-emerald-300 mt-6 mb-2">9.2 Complaint Management</h3>
                <p>
                  Complaints are managed via internal procedures for timely resolution. A dedicated form is available. Users are aware that if a booking is not accompanied by payment (deposit, down payment, or full cost), the manager/intermediary may not execute the services.
                </p>

                <h3 className="text-xl font-semibold text-emerald-300 mt-6 mb-2">9.3 Alternative Dispute Resolution</h3>
                <p>
                  The parties commit to attempting an amicable solution by promoting a mediation procedure before the Mediation Bodies based in the city of Rome.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-amber-300 mb-4">10. LIABILITY AND LIMITATIONS</h2>
                
                <h3 className="text-xl font-semibold text-emerald-300 mt-4 mb-2">10.1 Responsibility of the Manager</h3>
                <p>
                  The manager is responsible according to principles of qualified professional diligence for the tourist activity, maintaining the distinction between direct services (responsible) and intermediation (not responsible for the execution of intermediated services).
                </p>

                <h3 className="text-xl font-semibold text-emerald-300 mt-6 mb-2">10.2 Extraordinary Circumstances</h3>
                <p>
                  Liability is excluded for unavoidable and extraordinary circumstances that impede the execution of the services, as defined by art. 33 of the Tourism Code.
                </p>

                <h3 className="text-xl font-semibold text-emerald-300 mt-6 mb-2">10.3 Technical Limitations</h3>
                <p>
                  The manager is not responsible for service interruptions due to scheduled maintenance, technical problems, or force majeure events, provided they are promptly communicated.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-amber-300 mb-4">11. INTELLECTUAL PROPERTY</h2>
                
                <h3 className="text-xl font-semibold text-emerald-300 mt-4 mb-2">11.1 Copyright</h3>
                <p>
                  All content on the site is protected by copyright and cannot be reproduced without written authorization.
                </p>

                <h3 className="text-xl font-semibold text-emerald-300 mt-6 mb-2">11.2 Trademarks</h3>
                <p>
                  The trademarks present are the property of their respective owners and cannot be used without authorization.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-amber-300 mb-4">12. MODIFICATIONS TO THE TERMS</h2>
                
                <h3 className="text-xl font-semibold text-emerald-300 mt-4 mb-2">12.1 Updates</h3>
                <p>
                  These terms may be modified for regulatory adjustments or service improvements, with communication to registered users.
                </p>

                <h3 className="text-xl font-semibold text-emerald-300 mt-6 mb-2">12.2 Acceptance</h3>
                <p>
                  Continued use of the site after modifications constitutes acceptance of the new terms.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-amber-300 mb-4">13. APPLICABLE LAW AND COMPETENT JURISDICTION</h2>
                
                <h3 className="text-xl font-semibold text-emerald-300 mt-4 mb-2">13.1 Applicable Law</h3>
                <p>
                  These terms are governed by Italian law.
                </p>

                <h3 className="text-xl font-semibold text-emerald-300 mt-6 mb-2">13.2 Competent Jurisdiction</h3>
                <ul className="list-disc list-inside mt-3 space-y-1 ml-4">
                  <li>For disputes with consumers, the territorial jurisdiction of the Consumer Code applies.</li>
                  <li>For relationships with professionals, the Court of Rome is competent.</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-amber-300 mb-4">14. FINAL PROVISIONS</h2>
                
                <h3 className="text-xl font-semibold text-emerald-300 mt-4 mb-2">14.1 Partial Validity</h3>
                <p>
                  The eventual nullity of single clauses does not invalidate the contract as a whole.
                </p>

                <h3 className="text-xl font-semibold text-emerald-300 mt-6 mb-2">14.2 Contacts</h3>
                <p>
                  For information on these terms:
                </p>
                <div className="mt-3 ml-4">
                  <p><strong>ETERNAL CITY Enterprises Srls</strong></p>
                  <p>Registered office in Rome, Via Leccosa n. 54</p>
                  <p>CF/P.IVA 18285501005</p>
                  <p>Tel. +393518741550</p>
                  <p>Email: info@myguideinrome.com</p>
                  <p>PEC: Eternalcity@legalmail.it</p>
                </div>
              </div>

            </div>
          </div>
        </section>
      </div>
      
      <Footer />
    </div>
  );
}
