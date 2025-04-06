import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/common/Button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero section */}
      <section className="py-20 px-4 bg-gradient-to-b from-primary-50 to-surface-50">
        <div className="max-w-5xl mx-auto text-center">
          <Badge variant="primary" className="mb-4">Welcome to Kavach</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-surface-900 mb-6">
            Protecting Communities, Empowering Citizens
          </h1>
          <p className="text-xl text-surface-600 max-w-3xl mx-auto mb-8">
            A secure platform connecting citizens with law enforcement to create safer communities through collaboration and real-time reporting.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="font-medium">Get Started</Button>
            <Button size="lg" variant="outline" className="font-medium">Learn More</Button>
          </div>
        </div>
      </section>

      {/* Features section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-surface-800 mb-4">Key Features</h2>
            <p className="text-surface-600 max-w-2xl mx-auto">
              Our platform offers a range of tools to help citizens and law enforcement work together
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Incident Reporting</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-surface-600">
                  Report incidents quickly with location data, photos, and detailed descriptions.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Real-time Updates</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-surface-600">
                  Receive status updates on your reports and notifications about incidents in your area.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Community Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-surface-600">
                  Stay informed about safety concerns and emergency situations in your neighborhood.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-16 px-4 bg-primary-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-surface-800 mb-6">
            Join Kavach Today
          </h2>
          <p className="text-surface-600 mb-8">
            Be part of the solution for safer communities. Register now to start contributing.
          </p>
          <Button size="lg" variant="primary" className="font-medium">
            Register Now
          </Button>
        </div>
      </section>
    </main>
  );
}