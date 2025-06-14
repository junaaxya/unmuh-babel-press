// src/components/News/FilterTabs.js
import { faNewspaper, faCalendar, faList } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const FilterTabs = ({ activeFilter, onFilterChange, newsCount, eventCount }) => {
  const tabs = [
    {
      id: 'all',
      label: 'Semua',
      icon: faList,
      count: newsCount + eventCount
    },
    {
      id: 'news',
      label: 'Berita',
      icon: faNewspaper,
      count: newsCount
    },
    {
      id: 'events',
      label: 'Event',
      icon: faCalendar,
      count: eventCount
    }
  ];

  return (
    <div className="flex flex-wrap justify-center gap-2 mb-8 p-1 bg-gray-100 rounded-lg">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onFilterChange(tab.id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm transition-all duration-200 ${
            activeFilter === tab.id
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          <FontAwesomeIcon icon={tab.icon} className="w-4 h-4" />
          <span>{tab.label}</span>
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
            activeFilter === tab.id
              ? 'bg-blue-100 text-blue-600'
              : 'bg-gray-200 text-gray-600'
          }`}>
            {tab.count}
          </span>
        </button>
      ))}
    </div>
  );
};

export default FilterTabs;