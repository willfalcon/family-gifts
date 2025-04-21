import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | Family Gifts',
  description: 'Privacy Policy for Family Gifts application',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="container max-w-4xl mx-auto py-12 px-4 md:px-6">
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: April 21, 2025</p>
        </div>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Introduction</h2>
          <p>
            Welcome to Family Gifts. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you
            about how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
          </p>
          <p>
            This privacy policy applies to all users of Family Gifts, including those who use third-party authentication providers such as Facebook,
            Google, or other OAuth services to access our platform.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Information We Collect</h2>
          <p>We collect several types of information from and about users of our platform, including:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <span className="font-medium">Personal identifiers:</span> Such as name, email address, and profile picture, which may be collected
              directly from you or through third-party authentication providers.
            </li>
            <li>
              <span className="font-medium">Profile information:</span> Information you provide in your user profile, such as birthdays,
              anniversaries, relationships, and gift preferences.
            </li>
            <li>
              <span className="font-medium">Content data:</span> Information you post on our platform, including wish lists, gift ideas, event
              details, and messages.
            </li>
            <li>
              <span className="font-medium">Usage data:</span> Information about how you use our website, features, and services.
            </li>
            <li>
              <span className="font-medium">Technical data:</span> Internet protocol (IP) address, browser type and version, time zone setting and
              location, browser plug-in types and versions, operating system and platform, and other technology on the devices you use to access our
              platform.
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">How We Collect Your Information</h2>
          <p>We use different methods to collect data from and about you including through:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <span className="font-medium">Direct interactions:</span> Information you provide when you create an account, fill in forms, or
              correspond with us.
            </li>
            <li>
              <span className="font-medium">Third-party authentication:</span> When you choose to authenticate using a third-party provider (such as
              Facebook, Google, etc.), we receive personal information from that service, such as your name, email address, and profile picture. The
              specific information we receive depends on your settings with the third-party provider.
            </li>
            <li>
              <span className="font-medium">Automated technologies:</span> As you interact with our platform, we may automatically collect technical
              data about your equipment, browsing actions, and patterns.
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">How We Use Your Information</h2>
          <p>We use your information to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide, maintain, and improve our services</li>
            <li>Process and manage your account and preferences</li>
            <li>Facilitate family connections and gift coordination</li>
            <li>Send notifications about events, wish lists, and other relevant activities</li>
            <li>Respond to your comments, questions, and requests</li>
            <li>Monitor and analyze trends, usage, and activities in connection with our services</li>
            <li>Detect, investigate, and prevent fraudulent transactions and other illegal activities</li>
            <li>Comply with our legal obligations</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Information Sharing and Disclosure</h2>
          <p>We may share your personal information with:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <span className="font-medium">Family members and connections:</span> Information you provide may be shared with family members and other
              connections you establish on our platform, according to your privacy settings.
            </li>
            <li>
              <span className="font-medium">Service providers:</span> We may share your information with third-party vendors, service providers, and
              other business partners who need access to such information to carry out work on our behalf.
            </li>
            <li>
              <span className="font-medium">Legal requirements:</span> We may disclose your information if required to do so by law or in response to
              valid requests by public authorities.
            </li>
            <li>
              <span className="font-medium">Business transfers:</span> If we are involved in a merger, acquisition, or sale of all or a portion of our
              assets, your information may be transferred as part of that transaction.
            </li>
          </ul>
          <p>We do not sell your personal information to third parties.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Third-Party Authentication Providers</h2>
          <p>When you choose to log in or register using a third-party authentication provider (such as Facebook, Google, etc.), please note:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>We only receive information that you have authorized the provider to share with us.</li>
            <li>We do not have access to your passwords for these third-party services.</li>
            <li>The information we receive is dependent on your privacy settings with the third-party provider.</li>
            <li>We recommend reviewing the privacy policies of these third-party providers to understand how they handle your information.</li>
          </ul>
          <p>
            Our use of information received from these authentication providers is governed by this privacy policy. However, the information collected
            by these third-party providers is subject to their own privacy policies and practices.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Data Security</h2>
          <p>
            We have implemented appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an
            unauthorized way, altered, or disclosed. In addition, we limit access to your personal data to those employees, agents, contractors, and
            other third parties who have a business need to know.
          </p>
          <p>
            However, no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially
            acceptable means to protect your personal information, we cannot guarantee its absolute security.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Your Rights</h2>
          <p>Depending on your location, you may have certain rights regarding your personal information, including:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>The right to access your personal information</li>
            <li>The right to rectify inaccurate personal information</li>
            <li>The right to request the deletion of your personal information</li>
            <li>The right to restrict or object to the processing of your personal information</li>
            <li>The right to data portability</li>
            <li>The right to withdraw consent at any time, where we rely on consent to process your personal information</li>
          </ul>
          <p>To exercise these rights, please contact us using the information provided in the "Contact Us" section below.</p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Children's Privacy</h2>
          <p>
            Our services are not intended for children under the age of 13, and we do not knowingly collect personal information from children under
            13. If we learn we have collected or received personal information from a child under 13 without verification of parental consent, we will
            delete that information.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Changes to This Privacy Policy</h2>
          <p>
            We may update our privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page and
            updating the "Last updated" date at the top of this policy.
          </p>
          <p>
            You are advised to review this privacy policy periodically for any changes. Changes to this privacy policy are effective when they are
            posted on this page.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Contact Us</h2>
          <p>If you have any questions about this privacy policy or our privacy practices, please contact us at:</p>
          <p className="font-medium">Email: privacy@family.gifts</p>
          <p>We will respond to your request within a reasonable timeframe.</p>
        </section>

        <div className="pt-6">
          <Link href="/" className="text-primary hover:text-primary/80 transition-colors">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
