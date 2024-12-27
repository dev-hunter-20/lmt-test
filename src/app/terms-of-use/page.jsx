import NavbarPage from '@/layouts/main/NavbarPage';
import './page.scss';
import Link from 'next/link';

const sections = [
  {
    title: '1. Acceptance of Terms',
    content: `By registering for an account with Letmetrix ("Account"), you represent that you are authorized to do so and you agree to be bound by this Agreement, including any changes made to it. We may modify this Agreement at any time. We will use reasonable efforts to notify you of any substantial changes. Continued use of the Services after changes have been made will constitute your acceptance of the modified Agreement.`,
  },
  {
    title: '2. Definitions',
    content: '',
    list: [
      '<strong>"Confidential Information"</strong> includes all non-public information disclosed between the parties, whether in writing, orally, or by other means.',
      '<strong>"Data"</strong> encompasses all data you share with us, including personal data and confidential information.',
      '<strong>"Personal Data"</strong> is data that can identify an individual, either alone or in combination with other information.',
      '<strong>"Platform"</strong> refers to the products and services provided by Letmetrix as described on our website.',
    ],
  },
  {
    title: '3. Account Registration and Use',
    list: [
      '<strong>Account Security:</strong> You are responsible for all activities that occur under your Account and must keep your login details confidential.',
      '<strong>Use of Services:</strong> Letmetrix grants you a limited, non-exclusive, non-transferable license to use the Services for your internal business purposes in accordance with this Agreement.',
    ],
  },
  {
    title: '4. Intellectual Property',
    content:
      'All intellectual property rights in the Services, including any software, documentation, and content provided as part of the Services, are owned by Letmetrix or its licensors. You are granted no rights in or to the Services other than the limited right to use them under this Agreement.',
  },
  {
    title: '5. Confidentiality',
    content:
      'Each party agrees to retain in confidence all confidential information disclosed by the other party in connection with the Services and to use such confidential information solely for the purpose of fulfilling its obligations under this Agreement.',
  },
  {
    title: '6. Payments',
    content:
      'The fees for the Services are detailed during the registration process and in any order form or invoice we provide. You agree to pay all applicable fees as outlined in such documents.',
  },
  {
    title: '7. Termination',
    content:
      'Either party may terminate this Agreement for cause if the other party materially breaches the terms and fails to cure such breach within thirty (30) days after receiving written notice. Upon termination, you must cease using the Services and pay any outstanding fees.',
  },
  {
    title: '8. Disclaimer of Warranties',
    content:
      'The Services are provided "as is" without any warranties, express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, or non-infringement.',
  },
  {
    title: '9. Limitation of Liability',
    content:
      'Letmetrix will not be liable for any indirect, incidental, special, consequential, or punitive damages, regardless of the cause of action, even if advised of the possibility of such damages.',
  },
  {
    title: '10. Indemnification',
    content:
      'You agree to indemnify and hold harmless Letmetrix, its affiliates, officers, agents, and employees from any claim or demand made by any third party due to or arising out of your use of the Services, violation of this Agreement, or violation of any rights of another.',
  },
  {
    title: '11. Governing Law',
    content:
      'This Agreement shall be governed by and construed in accordance with the laws of Vietnam, without giving effect to its conflict of laws provisions.',
  },
  {
    title: '12. General Provisions',
    list: [
      '<strong>Entire Agreement:</strong> This Agreement constitutes the entire agreement between you and Letmetrix regarding the subject matter hereof.',
      '<strong>Severability:</strong> If any provision of this Agreement is found to be unenforceable, the remaining provisions will continue to be valid and enforceable.',
    ],
  },
];

const ContactInformation = () => (
  <div className="contact">
    <h4>Contact Information</h4>
    <p>
      If you have any questions about these Terms of Service or the Services, please contact us at: <br />
      Contact Email:{' '}
      <Link prefetch={false} href={'mailto:contact@letsmetrix.com'}>
        contact@letsmetrix.com
      </Link>{' '}
      <br />
      Address: 8th floor, Hoa Cuong Building 18/11 Thai Ha, Dong Da Dist, Hanoi <br />
      Head: No. 3, 175/55 Lane, Lac Long Quan St., Nghia Do Ward, Cau Giay District, Hanoi City, Vietnam <br />
      By using the Letmetrix Services, you acknowledge that you have read, understood, and agree to be bound by this
      Agreement.
    </p>
  </div>
);

const Section = ({ title, content, list }) => (
  <div>
    <h2>{title}</h2>
    {content && <p>{content}</p>}
    {list && (
      <ul>
        {list.map((item, index) => (
          <li key={index} dangerouslySetInnerHTML={{ __html: item }}></li>
        ))}
      </ul>
    )}
  </div>
);

export default function TermsOfUse() {
  return (
    <NavbarPage>
      <div className="term-of_use container">
        <div className="page-header">
          <Link prefetch={false} href={'/terms-of-use'} itemProp={'url'}>
            <h1>Terms of Use</h1>
          </Link>
        </div>
        <p>
          Welcome to Letmetrix. By signing up to use the Letmetrix platform, website, and services (collectively, the
          "Services"), you are entering into a binding contract with Letmetrix ("we", "us", "our"). These Terms of
          Service, together with our Data Processing Agreement, Privacy Policy, and Acceptable Use Policy (collectively,
          the "Agreement"), govern your use of our Services.
        </p>
        {sections.map((section, index) => (
          <Section key={index} {...section} />
        ))}
        <ContactInformation />
      </div>
    </NavbarPage>
  );
}
