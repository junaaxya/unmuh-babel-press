'use client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBook, faUsers } from '@fortawesome/free-solid-svg-icons'
import AnimatedCounter from '../ui/AnimatedCounter'



const iconMap = {
  'fa-book': faBook,
  'fa-users': faUsers,
}

const ProfileHero = ({ data }) => {
  const { title, subtitle, description, stats } = data

  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        {/* Animated background shapes */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-400 rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-400 rounded-full opacity-10 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white rounded-full opacity-5 animate-bounce"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16 text-center text-white">
        {/* Main content */}
        <div className="max-w-4xl mx-auto mb-16">
          <h1 className="text-4xl text md:text-6xl font-bold mb-4 animate-fade-in-up">
            {title}
          </h1>
          <p className="text-xl md:text-2xl mb-6 text-blue-100 animate-fade-in-up delay-200">
            {subtitle}
          </p>
          <p className="text-lg leading-relaxed text-gray-200 max-w-3xl mx-auto animate-fade-in-up delay-400">
            {description}
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 border border-white border-opacity-20 hover:bg-opacity-20 transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${600 + index * 100}ms` }}
            >
              <div className="flex flex-col items-center">
                <div className="mb-4 p-3 bg-blue-800 bg-opacity-20 rounded-full">
                  <FontAwesomeIcon 
                    icon={iconMap[stat.icon]} 
                    className="text-2xl text-blue-200"
                  />
                </div>
                <div className="mb-2">
                  <AnimatedCounter 
                    end={stat.number} 
                    suffix={stat.suffix}
                    duration={2000}
                  />
                </div>
                <p className="text-sm text-blue-800 font-medium text-center">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg 
          className="w-full h-16 fill-white dark:fill-gray-900" 
          viewBox="0 0 1200 120" 
          preserveAspectRatio="none"
        >
          <path d="M1200 120L0 16.48V120z" />
        </svg>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }
        
        .delay-200 {
          animation-delay: 200ms;
        }
        
        .delay-400 {
          animation-delay: 400ms;
        }
      `}</style>
    </section>
  )
}

export default ProfileHero
