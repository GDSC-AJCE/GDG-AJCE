import React, { useState, useEffect, createContext } from 'react';

const AdminContext = createContext();

const AdminProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "React Workshop: Building Modern UIs",
      date: "2025-10-15",
      time: "2:00 PM - 5:00 PM",
      location: "AJCE Campus, Seminar Hall",
      attendees: 45,
      maxAttendees: 60,
      status: "open",
      description: "Learn to build modern, responsive user interfaces with React. Perfect for beginners and intermediate developers.",
      poster: "/api/placeholder/400/300",
      registrationLink: "https://forms.google.com/d/e/1FAIpQLSe_example1/viewform",
      organizer: "GDG AJCE"
    },
    {
      id: 2,
      title: "JavaScript Conference 2025",
      date: "2025-11-02",
      time: "9:00 AM - 6:00 PM",
      location: "Virtual Event",
      attendees: 120,
      maxAttendees: 150,
      status: "open",
      description: "Join developers from around the world to discuss the latest trends in JavaScript and web development.",
      poster: "/api/placeholder/400/300",
      registrationLink: "https://forms.google.com/d/e/1FAIpQLSe_example2/viewform",
      organizer: "GDG AJCE"
    },
    {
      id: 3,
      title: "Web Development Meetup",
      date: "2025-11-20",
      time: "6:00 PM - 8:00 PM",
      location: "AJCE Campus, Computer Lab",
      attendees: 30,
      maxAttendees: 40,
      status: "open",
      description: "Monthly meetup for web developers to network, share projects, and learn from each other.",
      poster: "/api/placeholder/400/300",
      registrationLink: "https://forms.google.com/d/e/1FAIpQLSe_example3/viewform",
      organizer: "GDG AJCE"
    },
    {
      id: 4,
      title: "Cloud Study Jam",
      date: "2025-10-28",
      time: "10:00 AM - 4:00 PM",
      location: "AJCE Campus, Lab 2",
      attendees: 25,
      maxAttendees: 30,
      status: "full",
      description: "Hands-on workshop covering Google Cloud Platform basics and advanced features.",
      poster: "/api/placeholder/400/300",
      registrationLink: "https://forms.google.com/d/e/1FAIpQLSe_example4/viewform",
      organizer: "GDG AJCE"
    }
  ]);

  const [pastEvents] = useState([
    {
      id: 5,
      title: "Android Development Workshop",
      date: "2025-09-15",
      attendees: 55,
      description: "Introduction to Android development with Kotlin and modern best practices.",
      poster: "/api/placeholder/400/300"
    },
    {
      id: 6,
      title: "AI/ML Study Group",
      date: "2025-08-20",
      attendees: 40,
      description: "Exploring machine learning concepts and practical implementations.",
      poster: "/api/placeholder/400/300"
    }
  ]);

  // Check for existing admin session
  useEffect(() => {
    const adminSession = localStorage.getItem('gdg-admin-session');
    if (adminSession) {
      const session = JSON.parse(adminSession);
      if (session.expires > Date.now()) {
        setIsAuthenticated(true);
      } else {
        localStorage.removeItem('gdg-admin-session');
      }
    }
  }, []);

  const login = (password) => {
    // Simple password check - in production, use proper authentication
    if (password === 'gdg-admin-2025') {
      const session = {
        expires: Date.now() + (24 * 60 * 60 * 1000), // 24 hours
        timestamp: Date.now()
      };
      localStorage.setItem('gdg-admin-session', JSON.stringify(session));
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('gdg-admin-session');
    setIsAuthenticated(false);
  };

  const updateEvent = (eventId, updates) => {
    setEvents(prevEvents => 
      prevEvents.map(event => 
        event.id === eventId ? { ...event, ...updates } : event
      )
    );
  };

  const addEvent = (newEvent) => {
    const event = {
      ...newEvent,
      id: Date.now(), // Simple ID generation
      attendees: 0,
      organizer: "GDG AJCE"
    };
    setEvents(prevEvents => [...prevEvents, event]);
  };

  const deleteEvent = (eventId) => {
    setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
  };

  const value = {
    isAuthenticated,
    events,
    pastEvents,
    login,
    logout,
    updateEvent,
    addEvent,
    deleteEvent
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};

export { AdminContext };
export default AdminProvider;