'use client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faHistory, 
  faEye, 
  faUsers, 
  faPhone, 
  faCogs 
} from '@fortawesome/free-solid-svg-icons'

const TabNavigation = ({ tabs, activeTab, onTabChange, className = '' }) => {
  const iconMap = {
    sejarah: faHistory,
    'visi-misi': faEye,
    struktur: faUsers,
    kontak: faPhone,
    layanan: faCogs
  }

  return (
    <div className={`w-full ${className}`}>
      {/* Desktop Tab Navigation */}
      <div className="hidden md:flex border-b border-gray-200 dark:border-gray-700 mb-8">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative py-4 px-2 font-medium text-sm whitespace-nowrap transition-colors duration-200 ${
                activeTab === tab.id
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              <span className="flex items-center space-x-2">
                <FontAwesomeIcon 
                  icon={iconMap[tab.id]} 
                  className="text-sm"
                />
                <span>{tab.label}</span>
              </span>
              
              {/* Active indicator */}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400 transition-all duration-200"></span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Mobile Tab Navigation */}
      <div className="md:hidden mb-8">
        <div className="relative">
          <select
            value={activeTab}
            onChange={(e) => onTabChange(e.target.value)}
            className="w-full appearance-none bg-white dark:text-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {tabs.map((tab) => (
              <option key={tab.id} value={tab.id}>
                {tab.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <svg className="w-4 h-4 fill-current text-gray-400" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Alternative Mobile Tab Navigation (Scrollable) */}
      <div className="md:hidden mb-8 hidden">
        <div className="flex space-x-1 overflow-x-auto pb-2 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <span className="flex items-center space-x-2">
                <FontAwesomeIcon 
                  icon={iconMap[tab.id]} 
                  className="text-xs"
                />
                <span>{tab.label}</span>
              </span>
            </button>
          ))}
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}

export default TabNavigation