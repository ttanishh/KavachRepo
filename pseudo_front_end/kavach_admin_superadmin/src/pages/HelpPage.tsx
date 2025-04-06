
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { HelpCircle, Mail, MessageSquare, Phone } from "lucide-react";
import { toast } from "sonner";

export default function HelpPage() {
  const handleSupportSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    toast.success("Support request submitted", {
      description: "We'll get back to you as soon as possible.",
    });
    // Reset form
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Help & Support</h1>
        <p className="text-muted-foreground mt-2">
          Find answers to common questions and get support
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>
                Quick answers to common questions about using KAVACH
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>How does KAVACH protect my identity?</AccordionTrigger>
                  <AccordionContent>
                    KAVACH uses advanced cryptographic techniques to protect your identity. Your phone number 
                    is hashed with a salt before being stored on the blockchain, making it impossible to 
                    identify you from the public blockchain data. Reports are associated with this hashed 
                    identifier, not your actual identity or personal information.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger>What happens after I submit a report?</AccordionTrigger>
                  <AccordionContent>
                    After submission, your report is stored on the blockchain with a status of "pending." 
                    Authorized law enforcement agencies can access the report details and begin an investigation. 
                    As the investigation progresses, they will update the status to "investigating" and eventually 
                    "resolved." You can track the status of your report using the unique report ID.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger>How is data stored on the blockchain?</AccordionTrigger>
                  <AccordionContent>
                    KAVACH uses a hybrid storage approach. Basic report metadata (timestamps, status, category) 
                    is stored directly on the blockchain. Larger data such as detailed descriptions, images, 
                    or other evidence are stored on IPFS (InterPlanetary File System), with only the hash of 
                    this data stored on the blockchain. This ensures data integrity while keeping blockchain 
                    storage costs manageable.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4">
                  <AccordionTrigger>Can I add evidence to my report later?</AccordionTrigger>
                  <AccordionContent>
                    Yes, you can add additional evidence to an existing report. The new evidence will be 
                    linked to your original report on the blockchain, creating a verifiable timeline of 
                    when each piece of evidence was submitted. This helps maintain the integrity of the 
                    reporting and investigation process.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5">
                  <AccordionTrigger>Who can see my reports?</AccordionTrigger>
                  <AccordionContent>
                    Your reports are visible only to you and authorized law enforcement entities who have 
                    been granted access to the KAVACH system. The public blockchain contains encrypted and 
                    hashed data, making it impossible for unauthorized parties to view the actual contents 
                    of your reports.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-6">
                  <AccordionTrigger>Do I need a crypto wallet to use KAVACH?</AccordionTrigger>
                  <AccordionContent>
                    No, KAVACH is designed to be accessible to everyone without requiring technical knowledge 
                    of blockchain or cryptocurrency. You only need your phone number to authenticate. Our 
                    system handles all the blockchain interactions in the background, making the experience 
                    seamless for you.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Contact Support</CardTitle>
              <CardDescription>
                Need additional help? Get in touch with our support team
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSupportSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium">
                    Name
                  </label>
                  <Input id="name" placeholder="Your name" required />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium">
                    Email
                  </label>
                  <Input id="email" type="email" placeholder="Your email address" required />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="issue" className="block text-sm font-medium">
                    Issue
                  </label>
                  <Input id="issue" placeholder="Subject of your inquiry" required />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="message" className="block text-sm font-medium">
                    Message
                  </label>
                  <Textarea 
                    id="message" 
                    placeholder="Describe your issue in detail" 
                    rows={4} 
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full">
                  Submit
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-3">
              <HelpCircle className="h-5 w-5 text-civic-primary" />
              <span className="text-sm">Visit the <a href="#" className="text-civic-primary hover:underline">Knowledge Base</a></span>
            </div>
            
            <div className="flex items-center gap-3">
              <MessageSquare className="h-5 w-5 text-civic-primary" />
              <span className="text-sm">Chat with us on <a href="#" className="text-civic-primary hover:underline">WhatsApp</a></span>
            </div>
            
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-civic-primary" />
              <span className="text-sm">Email us at <a href="mailto:support@kavach.org" className="text-civic-primary hover:underline">support@kavach.org</a></span>
            </div>
            
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-civic-primary" />
              <span className="text-sm">Call our helpline: <a href="tel:+1234567890" className="text-civic-primary hover:underline">+1 (234) 567-890</a></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
