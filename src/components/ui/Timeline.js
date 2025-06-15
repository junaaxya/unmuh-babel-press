'use client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons'

const Timeline = ({ items, className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      {/* Timeline line */}
      <div className="absolute left-4 md:left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 to-purple-500"></div>
      
      <div className="space-y-8">
        {items.map((item, index) => (
          <div key={index} className="relative flex items-start space-x-4 md:space-x-8">
            {/* Timeline dot */}
            <div className="relative z-10 flex-shrink-0">
              <div className="w-8 h-8 bg-white dark:bg-gray-800 border-4 border-blue-500 rounded-full flex items-center justify-center shadow-lg">
                <FontAwesomeIcon 
                  icon={faCalendarAlt} 
                  className="text-blue-500 text-xs"
                />
              </div>
            </div>
            
            {/* Content */}
            <div className="flex-grow pb-8">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {item.title}
                  </h3>
                  <span className="inline-block px-3 py-1 text-sm font-semibold bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full mt-2 md:mt-0">
                    {item.year}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Timeline