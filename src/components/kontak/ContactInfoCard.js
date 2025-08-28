// src/components/Kontak/ContactInfoCard.js
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFacebook as faFacebookBrand,
  faInstagram as faInstagramBrand,
  faTwitter as faTwitterBrand,
  faLinkedin as faLinkedinBrand,
  faWhatsapp as faWhatsappBrand,
  faYoutube as faYoutubeBrand,
  faTelegram as faTelegramBrand,
} from '@fortawesome/free-brands-svg-icons';

export default function ContactInfoCard({ data }) {
  if (!data) return null;

  const address = `${data.addressStreet}, ${data.addressCity}, ${data.addressProvince}, ${data.addressPostal}`;

  const socialIconMap = {
    'fa-facebook': faFacebookBrand,
    'fa-instagram': faInstagramBrand,
    'fa-twitter': faTwitterBrand,
    'fa-linkedin': faLinkedinBrand,
    'fa-whatsapp': faWhatsappBrand,
    'fa-youtube': faYoutubeBrand,
    'fa-telegram': faTelegramBrand,
  };

  const getSocialColorClass = (platform) => {
    const colors = {
      Facebook: 'text-blue-600 hover:text-blue-700',
      Instagram: 'text-pink-600 hover:text-pink-700',
      Twitter: 'text-blue-400 hover:text-blue-500',
      LinkedIn: 'text-blue-700 hover:text-blue-800',
      WhatsApp: 'text-green-600 hover:text-green-700',
      YouTube: 'text-red-600 hover:text-red-700',
      Telegram: 'text-blue-500 hover:text-blue-600',
    };
    return colors[platform] || 'text-gray-600 hover:text-gray-700';
  };

  const contactInfo = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: 'Alamat Kantor',
      content: address,
      isMultiLine: true,
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Email Resmi',
      content: data.emailGeneral,
      link: `mailto:${data.emailGeneral}`,
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
        </svg>
      ),
      title: 'WhatsApp',
      content: data.phoneWhatsapp || data.phoneNumber,
      link: `https://wa.me/${(data.phoneWhatsapp || '').replace(/[^0-9]/g, '')}`,
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'Jam Operasional',
      content: `${data.hoursWeekdays || ''}\n${data.hoursWeekend || ''}`,
      isMultiLine: true,
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Informasi Kontak</h2>

      <div className="space-y-6">
        {contactInfo.map((info, index) => (
          <div key={index} className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">{info.icon}</div>

            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-gray-900 mb-1">{info.title}</h3>

              {info.link ? (
                <a
                  href={info.link}
                  target={info.link.startsWith('http') ? '_blank' : undefined}
                  rel={info.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="text-gray-600 hover:text-blue-600 transition-colors inline-flex items-center gap-1 group"
                >
                  {info.content}
                  {info.link.startsWith('http') && (
                    <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  )}
                </a>
              ) : (
                <div className="text-gray-600">{info.isMultiLine ? info.content.split('\n').map((line, lineIndex) => <div key={lineIndex}>{line}</div>) : info.content}</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {data.socialLinks?.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-4">
          {data.socialLinks.map((s, i) => (
            <a
              key={i}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors ${getSocialColorClass(s.platform)}`}
            >
              <FontAwesomeIcon icon={socialIconMap[s.icon]} className="text-lg" />
              <span className="font-medium">{s.platform}</span>
            </a>
          ))}
        </div>
      )}

      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800 font-medium mb-2">🚀 Siap untuk memulai proyek bersama kami?</p>
        <p className="text-sm text-blue-700">Hubungi kami sekarang dan dapatkan konsultasi gratis untuk kebutuhan bisnis Anda.</p>
      </div>
    </div>
  );
}