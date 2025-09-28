import React from 'react';
import { 
  Users, 
  Code, 
  Puzzle, 
  Zap, 
  Shield, 
  BarChart3, 
  GitBranch, 
  Smartphone,
  Globe,
  Database,
  Cloud,
  BookOpen
} from 'lucide-react';

const Core = () => {
  const coreFeatures = [
    {
      id: 1,
      title: "Real-time Collaboration",
      description: "Work together with your team in real-time. Share code, ideas, and solutions instantly.",
      icon: Users,
      color: "blue",
      benefits: ["Live code sharing", "Instant messaging", "Video calls integration", "Shared workspaces"]
    },
    {
      id: 2,
      title: "Integrated Development Environment",
      description: "Complete IDE experience with modern tools and features for productive development.",
      icon: Code,
      color: "green",
      benefits: ["Syntax highlighting", "IntelliSense", "Debugging tools", "Extensions marketplace"]
    },
    {
      id: 3,
      title: "Extensive Plugin Support",
      description: "Customize your experience with thousands of plugins and extensions.",
      icon: Puzzle,
      color: "purple",
      benefits: ["Language support", "Theme customization", "Workflow automation", "Third-party integrations"]
    },
    {
      id: 4,
      title: "Performance Analytics",
      description: "Track your coding performance and learning progress with detailed analytics.",
      icon: BarChart3,
      color: "orange",
      benefits: ["Code metrics", "Time tracking", "Progress reports", "Performance insights"]
    },
    {
      id: 5,
      title: "Version Control",
      description: "Built-in Git integration for seamless version control and collaboration.",
      icon: GitBranch,
      color: "red",
      benefits: ["Git integration", "Branch management", "Merge conflict resolution", "History tracking"]
    },
    {
      id: 6,
      title: "Cloud Integration",
      description: "Seamlessly work with cloud services and deploy your applications with ease.",
      icon: Cloud,
      color: "indigo",
      benefits: ["Cloud deployment", "Service integration", "Auto-scaling", "Monitoring tools"]
    }
  ];

  const technologies = [
    { name: "React", icon: Code },
    { name: "Node.js", icon: Globe },
    { name: "Python", icon: Database },
    { name: "Mobile", icon: Smartphone },
    { name: "Cloud", icon: Cloud },
    { name: "AI/ML", icon: Zap }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: "bg-blue-50 text-blue-600 border-blue-100",
      green: "bg-green-50 text-green-600 border-green-100",
      purple: "bg-purple-50 text-purple-600 border-purple-100",
      orange: "bg-orange-50 text-orange-600 border-orange-100",
      red: "bg-red-50 text-red-600 border-red-100",
      indigo: "bg-indigo-50 text-indigo-600 border-indigo-100"
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="flex flex-col gap-6 mb-12">
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight mb-4">
            Core Features
          </h1>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Discover the powerful features that make our platform the perfect choice 
            for developers and teams of all sizes.
          </p>
        </div>
      </div>

      {/* Features Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {coreFeatures.map((feature) => {
          const IconComponent = feature.icon;
          return (
            <div key={feature.id} className="bg-white border border-neutral-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg border ${getColorClasses(feature.color)}`}>
                  <IconComponent className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-neutral-600 mb-4">
                    {feature.description}
                  </p>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-neutral-900">Key Benefits:</h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                      {feature.benefits.map((benefit, index) => (
                        <li key={index} className="text-sm text-neutral-600 flex items-center gap-2">
                          <div className="h-1.5 w-1.5 bg-neutral-400 rounded-full flex-shrink-0"></div>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Technologies Section */}
      <section className="mb-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold mb-4">Supported Technologies</h2>
          <p className="text-neutral-600">
            Our platform supports a wide range of technologies and frameworks
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {technologies.map((tech, index) => {
            const IconComponent = tech.icon;
            return (
              <div key={index} className="bg-white border border-neutral-200 rounded-lg p-4 text-center hover:shadow-md transition-shadow">
                <IconComponent className="h-8 w-8 text-neutral-600 mx-auto mb-2" />
                <span className="text-sm font-medium text-neutral-900">{tech.name}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-blue-50 to-purple-50 border border-neutral-200 rounded-lg p-8 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Ready to Experience These Features?</h2>
          <p className="text-neutral-600 mb-6">
            Join thousands of developers who are already using our platform to build amazing applications.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Get Started Free
            </button>
            <button className="px-6 py-3 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 transition-colors font-medium">
              View Documentation
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Core;
