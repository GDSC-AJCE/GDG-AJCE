import React from 'react';
import { Users, Trophy, LayoutList, Calendar, Code, Zap } from 'lucide-react';
import StatsCard from '../components/StatsCard';

const Home = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="flex flex-col gap-6 mb-12">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight mb-4">
            Welcome to GDG AJCE
          </h1>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Join our vibrant community of developers, participate in study jams, attend events, 
            and grow your technical skills with Google Developer Group AJCE.
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
        <StatsCard
          title="Active Members"
          value="250+"
          icon={Users}
          changeType="increase"
        />
        <StatsCard
          title="Events Hosted"
          value="45+"
          icon={Calendar}
          changeType="increase"
        />
        <StatsCard
          title="Study Jams"
          value="12+"
          icon={Trophy}
          changeType="increase"
        />
      </section>

      {/* Features Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <div className="bg-white border border-neutral-200 rounded-lg p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Trophy className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold">Study Jams</h3>
          </div>
          <p className="text-neutral-600">
            Participate in structured learning programs and track your progress on our leaderboard.
          </p>
        </div>

        <div className="bg-white border border-neutral-200 rounded-lg p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-50 rounded-lg">
              <Calendar className="h-5 w-5 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold">Events</h3>
          </div>
          <p className="text-neutral-600">
            Join workshops, meetups, and conferences to connect with fellow developers.
          </p>
        </div>

        <div className="bg-white border border-neutral-200 rounded-lg p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Code className="h-5 w-5 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold">Core Features</h3>
          </div>
          <p className="text-neutral-600">
            Explore our platform's core features designed to enhance your learning experience.
          </p>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-blue-50 to-purple-50 border border-neutral-200 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-semibold mb-4">Ready to Get Started?</h2>
        <p className="text-neutral-600 mb-6 max-w-lg mx-auto">
          Join our community today and start your journey with Google Developer Group AJCE.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Join Study Jam
          </button>
          <button className="px-6 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors">
            View Events
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;