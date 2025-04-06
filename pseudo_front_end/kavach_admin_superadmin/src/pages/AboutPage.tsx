
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Lock, FileText, Users, Database, Server } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="space-y-8">
      <div className="text-center max-w-3xl mx-auto">
        <Shield className="h-16 w-16 mx-auto text-civic-primary mb-4" />
        <h1 className="text-4xl font-bold">About KAVACH</h1>
        <p className="text-xl mt-4 text-muted-foreground">
          KAVACH is a decentralized crime reporting platform powered by blockchain technology,
          designed to create a secure and transparent system for citizens to report incidents 
          while maintaining privacy and anonymity.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
        <Card className="p-6">
          <div className="flex items-start gap-4">
            <Lock className="h-8 w-8 text-civic-primary flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-xl font-bold mb-2">Privacy & Security</h2>
              <p className="text-muted-foreground">
                KAVACH uses advanced cryptography and blockchain technology to ensure that sensitive 
                information is protected. Your identity remains anonymous while still allowing for 
                transparent tracking of reports.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start gap-4">
            <Database className="h-8 w-8 text-civic-primary flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-xl font-bold mb-2">Blockchain Technology</h2>
              <p className="text-muted-foreground">
                All reports are securely stored on the blockchain, ensuring data integrity and 
                immutability. This means that once a report is submitted, it cannot be tampered with 
                or deleted, providing a reliable record of incidents.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start gap-4">
            <Users className="h-8 w-8 text-civic-primary flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-xl font-bold mb-2">Community Empowerment</h2>
              <p className="text-muted-foreground">
                KAVACH empowers citizens to actively participate in creating safer communities by 
                providing an accessible platform to report incidents. The collective data helps 
                identify crime patterns and improve public safety measures.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start gap-4">
            <FileText className="h-8 w-8 text-civic-primary flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-xl font-bold mb-2">Transparent Tracking</h2>
              <p className="text-muted-foreground">
                Track the status of your reports as they move through the investigation process. 
                The blockchain ensures transparency in how reports are handled while maintaining 
                your privacy.
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="bg-civic-light rounded-lg p-8 mt-12">
        <h2 className="text-2xl font-bold mb-4 text-center">How KAVACH Works</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
          <div className="text-center">
            <div className="bg-civic-primary text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
              1
            </div>
            <h3 className="font-bold mb-2">Submit Report</h3>
            <p className="text-sm text-muted-foreground">
              Citizens submit reports anonymously through the KAVACH platform, providing details 
              about incidents including location, description, and evidence.
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-civic-primary text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
              2
            </div>
            <h3 className="font-bold mb-2">Blockchain Storage</h3>
            <p className="text-sm text-muted-foreground">
              Reports are securely stored on the blockchain, with sensitive details in IPFS, 
              ensuring data integrity while maintaining privacy.
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-civic-primary text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
              3
            </div>
            <h3 className="font-bold mb-2">Investigation & Updates</h3>
            <p className="text-sm text-muted-foreground">
              Authorized agencies investigate reports and update statuses, which are recorded 
              on the blockchain for full transparency.
            </p>
          </div>
        </div>
      </div>

      <div className="text-center max-w-3xl mx-auto mt-12 pb-8">
        <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
        <p className="text-lg">
          KAVACH aims to revolutionize crime reporting by leveraging blockchain technology to 
          create a secure, transparent, and efficient system that empowers citizens while 
          protecting their privacy.
        </p>
      </div>
    </div>
  );
}
