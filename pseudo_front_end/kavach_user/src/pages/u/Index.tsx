
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import { Shield, MapPin, BarChart3, Lock } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-kavach-700 to-kavach-800 text-white py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
                  Report crimes in real time with Kavach
                </h1>
                <p className="text-lg md:text-xl opacity-90 max-w-xl">
                Your first step towards shielding your safety
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/report">
                    <Button size="lg" className="bg-alert hover:bg-alert/90">
                      <MapPin className="mr-2 h-5 w-5" />
                      Report a Crime
                    </Button>
                  </Link>
                  <Link to="http://localhost:8080/login">
                    <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" >
                      <BarChart3 className="mr-2 h-5 w-5" />
                      Emergency Report
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="relative">
                  <div className="p-8 bg-white/10 rounded-2xl backdrop-blur-sm shadow-xl border border-white/20">
                    <Shield className="h-32 w-32 mx-auto mb-4 text-white" />
                    <h3 className="text-2xl font-bold text-center">Secure & Verifiable</h3>
                    <p className="text-center mt-2 opacity-90">
                      Your reports are secured with blockchain technology for maximum data integrity and transparency.
                    </p>
                  </div>
                  <div className="absolute -right-4 -bottom-4 p-6 bg-white/10 rounded-xl backdrop-blur-sm shadow-lg border border-white/20">
                    <Lock className="h-10 w-10 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 bg-gray-50 dark:bg-kavach-900/30">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">How Kavach Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-kavach-800/50 p-6 rounded-xl shadow-md">
                <div className="w-12 h-12 bg-kavach-100 dark:bg-kavach-700 rounded-lg flex items-center justify-center mb-4">
                  <MapPin className="h-6 w-6 text-kavach-600 dark:text-kavach-200" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Easy Reporting</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Quickly and easily report crimes with our intuitive interface. Pinpoint locations on the map and provide details.
                </p>
              </div>
              <div className="bg-white dark:bg-kavach-800/50 p-6 rounded-xl shadow-md">
                <div className="w-12 h-12 bg-kavach-100 dark:bg-kavach-700 rounded-lg flex items-center justify-center mb-4">
                  <Lock className="h-6 w-6 text-kavach-600 dark:text-kavach-200" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Secure Blockchain</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Your reports are secured with blockchain technology, ensuring data integrity and immutability.
                </p>
              </div>
              <div className="bg-white dark:bg-kavach-800/50 p-6 rounded-xl shadow-md">
                <div className="w-12 h-12 bg-kavach-100 dark:bg-kavach-700 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-kavach-600 dark:text-kavach-200" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Interactive Dashboard</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  View crime statistics and reports in real-time through our interactive dashboard and map visualization.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-kavach-600 to-kavach-500 text-white">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Join the Kavach Network Today</h2>
            <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto mb-6">
              Be part of the solution by reporting crimes in your area and helping law enforcement respond more effectively.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/auth">
                <Button size="lg" variant="secondary" className="border-white text-kavach-600">
                  Create an Account
                </Button>
              </Link>
              <Link to="/report">
                <Button size="lg" className="bg-alert hover:bg-alert/90">
                  <MapPin className="mr-2 h-5 w-5" />
                  Report a Crime
                </Button>
              </Link>
            </div>
          </div>
        </section>
        <section className="py-16 bg-gradient-to-r from-kavach-600 to-kavach-500 text-white">


        </section>
      </div>
      
      {/* Footer */}
      <footer className="bg-kavach-800 text-white py-8">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <Shield className="h-6 w-6 mr-2" />
              <span className="font-bold text-xl">Kavach</span>
            </div>
            <div className="text-sm opacity-70">
              &copy; 2025 Kavach | For local development and testing purposes only
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
