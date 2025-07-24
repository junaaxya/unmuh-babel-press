// src/app/(main)/event/[slug]/page.js
import { notFound } from 'next/navigation';
import eventData from '@/data/event';
import ClientImage from '@/components/admin/berita-event/ClientImage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendarAlt, 
  faMapMarkerAlt, 
  faClock,
  faUser,
  faTag, 
  faShare, 
  faArrowLeft,
  faTicketAlt
} from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

export async function generateStaticParams() {
  return eventData.map((event) => ({
    slug: event.slug,
  }));
}

export default async function EventDetailPage({ params }) {
  const { slug } = params;

  const event = eventData.find(item => item.slug === slug);

  if (!event) {
    notFound();
  }

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'Upcoming': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Akan Datang' },
      'Ongoing': { bg: 'bg-green-100', text: 'text-green-800', label: 'Berlangsung' },
      'Completed': { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Selesai' },
      'Cancelled': { bg: 'bg-red-100', text: 'text-red-800', label: 'Dibatalkan' }
    };

    const config = statusConfig[status] || statusConfig['Completed'];
    
    return (
      <span className={`px-3 py-1 text-sm font-medium rounded-full ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <Link 
            href="/berita-event"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
            Kembali ke Berita & Event
          </Link>
          
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-full">
                {event.category}
              </span>
              {getStatusBadge(event.status)}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              {event.title}
            </h1>
            <p className="text-xl text-gray-600">
              {event.excerpt}
            </p>
          </div>

          {/* Event Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
            <div className="flex items-center text-gray-600">
              <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 text-blue-500" />
              <div>
                <div className="text-sm text-gray-500">Tanggal</div>
                <div className="font-medium">{formatDate(event.date)}</div>
              </div>
            </div>
            <div className="flex items-center text-gray-600">
              <FontAwesomeIcon icon={faClock} className="mr-2 text-green-500" />
              <div>
                <div className="text-sm text-gray-500">Waktu</div>
                <div className="font-medium">{event.time}</div>
              </div>
            </div>
            <div className="flex items-center text-gray-600">
              <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-2 text-red-500" />
              <div>
                <div className="text-sm text-gray-500">Lokasi</div>
                <div className="font-medium">{event.location}</div>
              </div>
            </div>
            <div className="flex items-center text-gray-600">
              <FontAwesomeIcon icon={faUser} className="mr-2 text-purple-500" />
              <div>
                <div className="text-sm text-gray-500">Penyelenggara</div>
                <div className="font-medium">{event.organizer}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Featured Image */}
          <div className="aspect-video bg-gray-200">
             <ClientImage
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover"
            />
          </div>

          {/* Event Content */}
          <div className="p-8">
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: event.content }}
            />
          </div>

          {/* Registration/Action Section */}
          {event.status === 'Upcoming' && (
            <div className="px-8 py-6 border-t border-gray-200 bg-blue-50">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-gray-900">Tertarik mengikuti event ini?</h3>
                  <p className="text-gray-600">Daftarkan diri Anda sekarang juga!</p>
                </div>
                <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center">
                  <FontAwesomeIcon icon={faTicketAlt} className="mr-2" />
                  Daftar Sekarang
                </button>
              </div>
            </div>
          )}

          {/* Share Section */}
          <div className="px-8 py-6 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 font-medium">
                <FontAwesomeIcon icon={faShare} className="mr-2" />
                Bagikan Event
              </span>
              <div className="flex space-x-3">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Facebook
                </button>
                <button className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors">
                  Twitter
                </button>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Related Events */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Event Terkait</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {eventData
              .filter(item => item.id !== event.id && item.category === event.category)
              .slice(0, 2)
              .map(relatedEvent => (
                <Link
                  key={relatedEvent.id}
                  href={`/event/${relatedEvent.slug}`}
                  className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="aspect-video bg-gray-200">
                    <ClientImage
                      src={relatedEvent.image}
                      alt={relatedEvent.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-purple-600 bg-purple-100 px-2 py-1 rounded">
                        {relatedEvent.category}
                      </span>
                      {getStatusBadge(relatedEvent.status)}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {relatedEvent.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">
                      {relatedEvent.excerpt}
                    </p>
                    <div className="space-y-1 text-xs text-gray-500">
                      <div className="flex items-center">
                        <FontAwesomeIcon icon={faCalendarAlt} className="mr-1" />
                        {formatDate(relatedEvent.date)}
                      </div>
                      <div className="flex items-center">
                        <FontAwesomeIcon icon={faMapMarkerAlt} className="mr-1" />
                        {relatedEvent.location}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}