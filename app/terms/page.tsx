import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service | Family Gifts',
  description: 'Terms of Service for Family Gifts',
};

export default function TermsOfService() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>

      <div className="prose prose-slate max-w-none">
        <p className="text-muted-foreground mb-6">Last Updated: April 21, 2025</p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
          <p>
            Welcome to Family Gifts ("we," "our," or "us"). By accessing or using our website, mobile application, and services (collectively, the
            "Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use the Service.
          </p>
          <p>These Terms constitute a legally binding agreement between you and Family Gifts regarding your use of the Service.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Eligibility</h2>
          <p>
            You must be at least 13 years old to use the Service. By using the Service, you represent and warrant that you are at least 13 years old
            and that your use of the Service does not violate any applicable laws or regulations.
          </p>
          <p>
            If you are using the Service on behalf of an organization, you represent and warrant that you have the authority to bind that organization
            to these Terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. Account Registration</h2>
          <p>
            To access certain features of the Service, you may need to register for an account. When you register, you agree to provide accurate,
            current, and complete information about yourself and to update this information to maintain its accuracy.
          </p>
          <p>
            You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
            You agree to notify us immediately of any unauthorized use of your account.
          </p>
          <p>
            We reserve the right to suspend or terminate your account if any information provided during registration or thereafter proves to be
            inaccurate, false, or misleading.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. User Content</h2>
          <p>
            The Service allows you to create, upload, post, send, receive, and store content, including messages, text, photos, and other materials
            (collectively, "User Content"). You retain all rights in and to your User Content.
          </p>
          <p>
            By submitting User Content to the Service, you grant us a worldwide, non-exclusive, royalty-free, sublicensable, and transferable license
            to use, reproduce, modify, adapt, publish, translate, create derivative works from, distribute, and display your User Content in
            connection with operating and providing the Service.
          </p>
          <p>
            You represent and warrant that: (i) you own your User Content or have the right to grant the rights and licenses contained in these Terms;
            and (ii) your User Content does not violate the privacy rights, publicity rights, intellectual property rights, or any other rights of any
            person.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Prohibited Conduct</h2>
          <p>You agree not to engage in any of the following prohibited activities:</p>
          <ul className="list-disc pl-6 mb-4">
            <li>Using the Service for any illegal purpose or in violation of any local, state, national, or international law;</li>
            <li>Harassing, threatening, or intimidating any other user of the Service;</li>
            <li>Posting or transmitting viruses, worms, malware, or other types of malicious code;</li>
            <li>Interfering with or disrupting the Service or servers or networks connected to the Service;</li>
            <li>Attempting to gain unauthorized access to the Service, other accounts, or computer systems or networks connected to the Service;</li>
            <li>Collecting or harvesting any personally identifiable information from the Service;</li>
            <li>Using the Service to send unsolicited communications, promotions, or advertisements, or spam;</li>
            <li>Impersonating another person or entity, or falsely stating or otherwise misrepresenting your affiliation with a person or entity;</li>
            <li>Using automated means, including spiders, robots, crawlers, data mining tools, or the like to download data from the Service;</li>
            <li>Bypassing the measures we may use to prevent or restrict access to the Service.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Intellectual Property Rights</h2>
          <p>
            The Service and its original content, features, and functionality are and will remain the exclusive property of Family Gifts and its
            licensors. The Service is protected by copyright, trademark, and other laws of both the United States and foreign countries.
          </p>
          <p>
            Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of Family
            Gifts.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Third-Party Links and Services</h2>
          <p>
            The Service may contain links to third-party websites or services that are not owned or controlled by Family Gifts. We have no control
            over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services.
          </p>
          <p>
            You acknowledge and agree that Family Gifts shall not be responsible or liable, directly or indirectly, for any damage or loss caused or
            alleged to be caused by or in connection with the use of or reliance on any such content, goods, or services available on or through any
            such websites or services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Termination</h2>
          <p>
            We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole
            discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
          </p>
          <p>If you wish to terminate your account, you may simply discontinue using the Service or contact us to request account deletion.</p>
          <p>
            All provisions of the Terms which by their nature should survive termination shall survive termination, including, without limitation,
            ownership provisions, warranty disclaimers, indemnity, and limitations of liability.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">9. Disclaimer of Warranties</h2>
          <p>
            THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED
            TO, IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
          </p>
          <p>
            FAMILY GIFTS DOES NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED OR ERROR-FREE, THAT DEFECTS WILL BE CORRECTED, OR THAT THE SERVICE OR
            THE SERVERS THAT MAKE IT AVAILABLE ARE FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">10. Limitation of Liability</h2>
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL FAMILY GIFTS, ITS AFFILIATES, DIRECTORS, EMPLOYEES, OR LICENSORS BE
            LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS,
            DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE SERVICE;</li>
            <li>ANY CONDUCT OR CONTENT OF ANY THIRD PARTY ON THE SERVICE;</li>
            <li>ANY CONTENT OBTAINED FROM THE SERVICE; AND</li>
            <li>UNAUTHORIZED ACCESS, USE, OR ALTERATION OF YOUR TRANSMISSIONS OR CONTENT,</li>
          </ul>
          <p>
            WHETHER BASED ON WARRANTY, CONTRACT, TORT (INCLUDING NEGLIGENCE), OR ANY OTHER LEGAL THEORY, WHETHER OR NOT WE HAVE BEEN INFORMED OF THE
            POSSIBILITY OF SUCH DAMAGE.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">11. Indemnification</h2>
          <p>
            You agree to defend, indemnify, and hold harmless Family Gifts, its affiliates, licensors, and service providers, and its and their
            respective officers, directors, employees, contractors, agents, licensors, suppliers, successors, and assigns from and against any claims,
            liabilities, damages, judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising out of or
            relating to your violation of these Terms or your use of the Service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">12. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of the state of [Your State], without regard to its conflict of
            law provisions.
          </p>
          <p>
            Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these
            Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">13. Changes to Terms</h2>
          <p>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at
            least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
          </p>
          <p>
            By continuing to access or use our Service after any revisions become effective, you agree to be bound by the revised terms. If you do not
            agree to the new terms, you are no longer authorized to use the Service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">14. Contact Us</h2>
          <p>If you have any questions about these Terms, please contact us at:</p>
          <p>Email: support@familygifts.com</p>
        </section>

        <div className="mt-12 border-t pt-6">
          <p>
            By using the Family Gifts service, you acknowledge that you have read these Terms of Service, understand them, and agree to be bound by
            them.
          </p>
          <p className="mt-4">
            <Link href="/privacy-policy" className="text-primary hover:underline">
              View our Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
