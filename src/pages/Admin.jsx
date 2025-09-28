import React, { useState } from 'react';
import { useAdmin } from '../hooks/useAdmin';
import { 
  Lock, 
  LogOut, 
  Plus, 
  Edit3, 
  Trash2, 
  Calendar, 
  MapPin, 
  Users, 
  Clock,
  ExternalLink,
  Image,
  Save,
  X
} from 'lucide-react';

const Admin = () => {
  const { isAuthenticated, events, login, logout, updateEvent, addEvent, deleteEvent } = useAdmin();
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [editingEvent, setEditingEvent] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    maxAttendees: '',
    status: 'open',
    description: '',
    poster: '',
    registrationLink: ''
  });

  const handleLogin = (e) => {
    e.preventDefault();
    const success = login(password);
    if (!success) {
      setLoginError('Invalid password');
    } else {
      setPassword('');
      setLoginError('');
    }
  };

  const handleUpdateEvent = (eventId, field, value) => {
    updateEvent(eventId, { [field]: value });
  };

  const handleSaveEdit = () => {
    setEditingEvent(null);
  };

  const handleAddEvent = (e) => {
    e.preventDefault();
    addEvent({...newEvent, maxAttendees: parseInt(newEvent.maxAttendees)});
    setNewEvent({
      title: '',
      date: '',
      time: '',
      location: '',
      maxAttendees: '',
      status: 'open',
      description: '',
      poster: '',
      registrationLink: ''
    });
    setShowAddForm(false);
  };

  const handleDeleteEvent = (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      deleteEvent(eventId);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="bg-white border border-neutral-200 rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Lock className="h-5 w-5 text-blue-600" />
            </div>
            <h1 className="text-xl font-semibold">Admin Login</h1>
          </div>
          
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter admin password"
                required
              />
              {loginError && (
                <p className="text-red-600 text-sm mt-1">{loginError}</p>
              )}
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Login
            </button>
          </form>
          
          <div className="mt-4 p-3 bg-neutral-50 rounded-lg">
            <p className="text-sm text-neutral-600">
              <strong>Demo Password:</strong> gdg-admin-2025
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-sm text-neutral-600 mt-1">
            Manage events, posters, and content
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Event
          </button>
          <button
            onClick={logout}
            className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>

      {/* Add Event Form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Add New Event</h2>
              <button
                onClick={() => setShowAddForm(false)}
                className="p-1 hover:bg-neutral-100 rounded"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddEvent} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Title</label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Time</label>
                  <input
                    type="text"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 2:00 PM - 5:00 PM"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Location</label>
                <input
                  type="text"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Max Attendees</label>
                <input
                  type="number"
                  value={newEvent.maxAttendees}
                  onChange={(e) => setNewEvent({...newEvent, maxAttendees: e.target.value})}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Description</label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Poster URL</label>
                <input
                  type="url"
                  value={newEvent.poster}
                  onChange={(e) => setNewEvent({...newEvent, poster: e.target.value})}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Google Form Registration Link</label>
                <input
                  type="url"
                  value={newEvent.registrationLink}
                  onChange={(e) => setNewEvent({...newEvent, registrationLink: e.target.value})}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="https://forms.google.com/..."
                  required
                />
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Events List */}
      <div className="space-y-6">
        {events.map((event) => (
          <div key={event.id} className="bg-white border border-neutral-200 rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                {editingEvent === event.id ? (
                  <input
                    type="text"
                    value={event.title}
                    onChange={(e) => handleUpdateEvent(event.id, 'title', e.target.value)}
                    className="text-xl font-semibold w-full px-2 py-1 border border-neutral-300 rounded"
                  />
                ) : (
                  <h3 className="text-xl font-semibold text-neutral-900">{event.title}</h3>
                )}
                
                <div className="flex items-center gap-4 mt-2 text-sm text-neutral-600">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {editingEvent === event.id ? (
                      <input
                        type="date"
                        value={event.date}
                        onChange={(e) => handleUpdateEvent(event.id, 'date', e.target.value)}
                        className="border border-neutral-300 rounded px-1"
                      />
                    ) : (
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {editingEvent === event.id ? (
                      <input
                        type="text"
                        value={event.time}
                        onChange={(e) => handleUpdateEvent(event.id, 'time', e.target.value)}
                        className="border border-neutral-300 rounded px-1"
                      />
                    ) : (
                      <span>{event.time}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {editingEvent === event.id ? (
                      <input
                        type="text"
                        value={event.location}
                        onChange={(e) => handleUpdateEvent(event.id, 'location', e.target.value)}
                        className="border border-neutral-300 rounded px-1"
                      />
                    ) : (
                      <span>{event.location}</span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {editingEvent === event.id ? (
                  <button
                    onClick={handleSaveEdit}
                    className="p-2 text-green-600 hover:bg-green-50 rounded"
                  >
                    <Save className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => setEditingEvent(event.id)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                )}
                <button
                  onClick={() => handleDeleteEvent(event.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Description</label>
                  {editingEvent === event.id ? (
                    <textarea
                      value={event.description}
                      onChange={(e) => handleUpdateEvent(event.id, 'description', e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
                      rows={3}
                    />
                  ) : (
                    <p className="text-neutral-600">{event.description}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Max Attendees</label>
                    {editingEvent === event.id ? (
                      <input
                        type="number"
                        value={event.maxAttendees}
                        onChange={(e) => handleUpdateEvent(event.id, 'maxAttendees', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
                      />
                    ) : (
                      <p className="text-neutral-600">{event.maxAttendees}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Status</label>
                    {editingEvent === event.id ? (
                      <select
                        value={event.status}
                        onChange={(e) => handleUpdateEvent(event.id, 'status', e.target.value)}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
                      >
                        <option value="open">Open</option>
                        <option value="full">Full</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    ) : (
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        event.status === 'open' ? 'bg-green-100 text-green-700' : 
                        event.status === 'full' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {event.status}
                      </span>
                    )}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Registration Link</label>
                  {editingEvent === event.id ? (
                    <input
                      type="url"
                      value={event.registrationLink}
                      onChange={(e) => handleUpdateEvent(event.id, 'registrationLink', e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
                    />
                  ) : (
                    <a
                      href={event.registrationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      Google Form <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Poster</label>
                {editingEvent === event.id ? (
                  <div className="space-y-2">
                    <input
                      type="url"
                      value={event.poster}
                      onChange={(e) => handleUpdateEvent(event.id, 'poster', e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
                      placeholder="Poster URL"
                    />
                    {event.poster && (
                      <img
                        src={event.poster}
                        alt="Event poster"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    )}
                  </div>
                ) : (
                  <div className="relative">
                    {event.poster ? (
                      <img
                        src={event.poster}
                        alt="Event poster"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-full h-32 bg-neutral-100 rounded-lg flex items-center justify-center">
                        <Image className="h-8 w-8 text-neutral-400" />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;