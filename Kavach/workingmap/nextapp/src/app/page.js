import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-50">
      <h1 className="text-4xl font-bold text-blue-800 mb-6">Kavach Security Platform</h1>
      
      <p className="text-lg text-gray-700 max-w-xl text-center mb-8">
        Welcome to Kavach, your community safety platform. Report and track crime incidents in your area through our interactive crime map.
      </p>
      
      <div className="flex gap-4">
        <Link href="/crime-map" 
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors">
          View Crime Map
        </Link>
        
        <Link href="/dashboard" 
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg shadow-md transition-colors">
          Dashboard
        </Link>
      </div>
      
      <div className="mt-12 p-6 bg-white rounded-lg shadow-lg max-w-2xl">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">About the Crime Map</h2>
        <p className="text-gray-600 mb-4">
          Our interactive crime map allows citizens to both report new crime incidents and view existing crime data in real-time. The map visualizes crime patterns and hotspots to help you stay informed about safety in your community.
        </p>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>View crime incidents by type or date</li>
          <li>Report new incidents with location and details</li>
          <li>Upload evidence photos or videos</li>
          <li>Receive real-time updates of new reports</li>
        </ul>
      </div>
    </main>
  );
}