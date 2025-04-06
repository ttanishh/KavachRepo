import Link from 'next/link';
import Image from 'next/image';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-primary-600">Kavach</h1>
          </div>
          <div className="space-x-4">
            <Link href="/auth/login" className="btn-outline">
              Login
            </Link>
            <Link href="/auth/signup" className="btn-primary">
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <section className="py-12 md:py-20 bg-gradient-to-br from-primary-500 to-secondary-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="md:w-1/2 space-y-6">
                <h1 className="text-4xl md:text-5xl font-bold">Report Crimes in Real-Time with Kavach</h1>
                <p className="text-lg md:text-xl opacity-90">
                  A secure platform for citizen reporting, helping keep our communities safe through immediate action and response.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/auth/signup" className="btn-secondary">
                    Create Account
                  </Link>
                  <Link href="/auth/emergency" className="bg-danger-600 text-white py-2 px-4 rounded-md font-medium hover:bg-danger-700 transition-colors inline-flex items-center justify-center">
                    Emergency Help
                  </Link>
                </div>
              </div>
              <div className="md:w-1/2 mt-8 md:mt-0">
                <div className="rounded-lg overflow-hidden shadow-2xl">
                  <div className="bg-white p-1 rounded-lg">
                    <div className="relative w-full h-96 bg-gray-100 rounded-lg">
                      <Image
                        src="/hero-image.jpg"
                        alt="Kavach Platform"
                        fill
                        className="object-cover rounded-lg"
                        priority
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="card">
                <div className="text-primary-600 text-4xl mb-4">1</div>
                <h3 className="text-xl font-bold mb-2">Report an Incident</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Quickly submit details, location, and media evidence through our intuitive reporting system.
                </p>
              </div>
              <div className="card">
                <div className="text-primary-600 text-4xl mb-4">2</div>
                <h3 className="text-xl font-bold mb-2">Real-time Assignment</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Our system automatically notifies the nearest police station for immediate response.
                </p>
              </div>
              <div className="card">
                <div className="text-primary-600 text-4xl mb-4">3</div>
                <h3 className="text-xl font-bold mb-2">Track Resolution</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Follow the status of your report from submission to resolution with complete transparency.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl font-bold">Kavach</h2>
              <p className="text-gray-400">Empowering citizens for safer communities</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="hover:text-primary-400 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-primary-400 transition-colors">
                Contact
              </a>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-gray-700 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Kavach. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
