'use client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faMapMarkerAlt, 
  faPhone, 
  faEnvelope, 
  faClock,
  faFacebook,
  faInstagram,
  faTwitter,
  faLinkedin,
  faWhatsapp
} from '@fortawesome/free-solid-svg-icons'
import { 
  faFacebook as faFacebookBrand,
  faInstagram as faInstagramBrand,
  faTwitter as faTwitterBrand,
  faLinkedin as faLinkedinBrand,
  faWhatsapp as faWhatsappBrand
} from '@fortawesome/free-brands-svg-icons'

const ContactInfo = ({ data }) => {
  const { address, phone, email, social, hours } = data

  const socialIconMap = {
    'fa-facebook': faFacebookBrand,
    'fa-instagram': faInstagramBrand,
    'fa-twitter': faTwitterBrand,
    'fa-linkedin': faLinkedinBrand,
    'fa-whatsapp': faWhatsappBrand
  }

  const getSocialColorClass = (platform) => {
    const colors = {
      Facebook: 'text-blue-600 hover:text-blue-700',
      Instagram: 'text-pink-600 hover:text-pink-700',
      Twitter: 'text-blue-400 hover:text-blue-500',
      LinkedIn: 'text-blue-700 hover:text-blue-800',
      WhatsApp: 'text-green-600 hover:text-green-700'
    }
    return colors[platform] || 'text-gray-600 hover:text-gray-700'
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {/* Address */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
            <FontAwesomeIcon 
              icon={faMapMarkerAlt} 
              className="text-red-600 dark:text-red-400 text-lg"
            />
          </div>
          <div className="flex-grow">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Alamat
            </h3>
            <div className="text-gray-600 dark:text-gray-300 space-y-1">
              <p>{address.street}</p>
              <p>{address.city}</p>
              <p>{address.province}</p>
              <p className="font-medium">{address.postal}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Phone */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
            <FontAwesomeIcon 
              icon={faPhone} 
              className="text-green-600 dark:text-green-400 text-lg"
            />
          </div>
          <div className="flex-grow">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Telepon
            </h3>
            <div className="space-y-2">
              <a 
                href={`tel:${phone.number}`}
                className="block text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors"
              >
                {phone.number}
              </a>
              <a 
                href={`https://wa.me/${phone.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-green-600 hover:text-green-700 transition-colors"
              >
                <FontAwesomeIcon icon={faWhatsappBrand} className="text-sm" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Email */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
            <FontAwesomeIcon 
              icon={faEnvelope} 
              className="text-blue-600 dark:text-blue-400 text-lg"
            />
          </div>
          <div className="flex-grow">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Email
            </h3>
            <div className="space-y-2">
              <a 
                href={`mailto:${email.general}`}
                className="block text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors break-all"
              >
                {email.general}
              </a>
              <a 
                href={`mailto:${email.submission}`}
                className="block text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors break-all text-sm"
              >
                {email.submission}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Operating Hours */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
            <FontAwesomeIcon 
              icon={faClock} 
              className="text-purple-600 dark:text-purple-400 text-lg"
            />
          </div>
          <div className="flex-grow">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Jam Operasional
            </h3>
            <div className="space-y-2 text-gray-600 dark:text-gray-300">
              <p>{hours.weekdays}</p>
              <p>{hours.weekend}</p>
              <p className="text-red-600 dark:text-red-400">{hours.closed}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Social Media */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 md:col-span-2">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center">
            <FontAwesomeIcon 
              icon={faFacebookBrand} 
              className="text-indigo-600 dark:text-indigo-400 text-lg"
            />
          </div>
          <div className="flex-grow">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Media Sosial
            </h3>
            <div className="flex flex-wrap gap-4">
              {social.map((item, index) => (
                <a
                  key={index}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors ${getSocialColorClass(item.platform)}`}
                >
                  <FontAwesomeIcon 
                    icon={socialIconMap[item.icon]} 
                    className="text-lg"
                  />
                  <span className="font-medium">{item.platform}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactInfo