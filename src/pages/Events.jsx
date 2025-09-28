import React from 'react';
import { Calendar, MapPin, Users, Clock, ExternalLink, Image } from 'lucide-react';
import { useAdmin } from '../hooks/useAdmin';

const Events = () => {
  const { events, pastEvents } = useAdmin();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="flex flex-col gap-6 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight">
            Events
          </h1>
          <p className="text-sm text-neutral-600 mt-1">
            Join our community events and expand your knowledge.
          </p>
        </div>
      </div>

      {/* Upcoming Events */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-6">Upcoming Events</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {events.map((event) => (
            <div key={event.id} className="bg-white border border-neutral-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
              {/* Event Poster */}
              {event.poster && (
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={event.poster}
                    alt={`${event.title} poster`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      event.status === 'open' ? 'bg-green-100 text-green-700' : 
                      event.status === 'full' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {event.status === 'open' ? 'Open' : event.status === 'full' ? 'Full' : 'Cancelled'}
                    </span>
                  </div>
                </div>
              )}
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-lg font-semibold text-neutral-900 flex-1">
                    {event.title}
                  </h3>
                  {!event.poster && (
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      event.status === 'open' ? 'bg-green-100 text-green-700' : 
                      event.status === 'full' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {event.status === 'open' ? 'Open' : event.status === 'full' ? 'Full' : 'Cancelled'}
                    </span>
                  )}
                </div>
                
                <p className="text-neutral-600 text-sm mb-4">{event.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-neutral-600">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-neutral-600">
                    <Clock className="h-4 w-4" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-neutral-600">
                    <MapPin className="h-4 w-4" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-neutral-600">
                    <Users className="h-4 w-4" />
                    <span>{event.attendees} / {event.maxAttendees} attendees</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                  <div className="flex-1 mr-4">
                    <div className="w-full bg-neutral-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(event.attendees / event.maxAttendees) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  {event.registrationLink ? (
                    <a
                      href={event.registrationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${
                        event.status === 'open' 
                          ? 'bg-blue-600 text-white hover:bg-blue-700' 
                          : 'bg-neutral-100 text-neutral-400 cursor-not-allowed pointer-events-none'
                      }`}
                    >
                      Register <ExternalLink className="h-3 w-3" />
                    </a>
                  ) : (
                    <button 
                      className="px-4 py-2 text-sm font-medium bg-neutral-100 text-neutral-400 rounded-lg cursor-not-allowed"
                      disabled
                    >
                      Coming Soon
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Past Events */}
      <section>
        <h2 className="text-xl font-semibold mb-6">Past Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pastEvents.map((event) => (
            <div key={event.id} className="bg-neutral-50 border border-neutral-200 rounded-lg overflow-hidden">
              {event.poster && (
                <div className="h-32 overflow-hidden">
                  <img
                    src={event.poster}
                    alt={`${event.title} poster`}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-4">
                <h3 className="font-medium text-neutral-900 mb-2">{event.title}</h3>
                <p className="text-sm text-neutral-600 mb-3">{event.description}</p>
                <div className="flex items-center justify-between text-sm text-neutral-500">
                  <span>{new Date(event.date).toLocaleDateString()}</span>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span>{event.attendees} attended</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Events;