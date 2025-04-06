
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Check, Shield, AlertTriangle } from "lucide-react";
import { emergencyReportContract } from "@/utils/blockchain";
import BlockchainInfo from "./BlockchainInfo";
import EvidenceUpload from "./EvidenceUpload";

// Define the schema for emergency report validation
const emergencyReportSchema = z.object({
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  location: z.string().min(3, {
    message: "Please provide a location.",
  }),
  contactInfo: z.string().optional(),
});

type EmergencyReportValues = z.infer<typeof emergencyReportSchema>;

const EmergencyReportForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [evidenceList, setEvidenceList] = useState<{
    file: File;
    description: string;
  }[]>([]);
  const [submittedReport, setSubmittedReport] = useState<{
    id: string;
    txHash: string;
  } | null>(null);
  const { toast } = useToast();
  
  const form = useForm<EmergencyReportValues>({
    resolver: zodResolver(emergencyReportSchema),
    defaultValues: {
      description: "",
      location: "",
      contactInfo: "",
    },
  });
  
  const handleEvidenceAdded = (evidence: { file: File; description: string }) => {
    setEvidenceList((prev) => [...prev, evidence]);
    toast({
      title: "Evidence Added",
      description: "Your evidence has been added to the report.",
    });
  };
  
  const onSubmit = async (values: EmergencyReportValues) => {
    try {
      setIsSubmitting(true);
      
      const reportData = {
        ...values,
        timestamp: new Date().toISOString(),
        evidence: evidenceList.map(item => ({
          fileUrl: URL.createObjectURL(item.file), // In a real app, this would be IPFS or similar
          fileType: item.file.type,
          description: item.description,
        })),
      };
      
      // Submit to blockchain (mock)
      const txHash = await emergencyReportContract.submitReport(reportData);
      const reportId = `ER-${Date.now().toString().slice(-6)}`;
      
      toast({
        title: "Emergency Report Submitted",
        description: "Your report has been recorded on the blockchain.",
        action: (
          <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center">
            <Check className="h-5 w-5 text-white" />
          </div>
        ),
      });
      
      setSubmittedReport({
        id: reportId,
        txHash
      });
      
      // Reset form
      form.reset();
      setEvidenceList([]);
      
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: "There was an error submitting your report. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card>
      <CardHeader className="bg-red-50 dark:bg-red-900/20">
        <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-400">
          <Shield className="h-5 w-5" />
          Emergency Report
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {submittedReport ? (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Check className="h-5 w-5 text-green-500" />
                </div>
                <div className="ml-3 w-full">
                  <h3 className="text-sm font-medium text-green-800">Report Submitted Successfully</h3>
                  <div className="mt-2 text-sm text-green-700">
                    <p>Your emergency report has been submitted to the blockchain for verification.</p>
                    <p className="mt-1">Report ID: <span className="font-mono">{submittedReport.id}</span></p>
                  </div>
                </div>
              </div>
            </div>
            
            <BlockchainInfo 
              reportId={submittedReport.id}
              transactionHash={submittedReport.txHash}
            />
            
            <Button
              onClick={() => setSubmittedReport(null)}
              className="w-full"
            >
              Submit Another Report
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-amber-50 border border-amber-100 rounded-lg p-4 flex gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800">
                <p className="font-medium">This is for emergency situations only</p>
                <p className="mt-1">Your report will be submitted to the blockchain for permanent record.</p>
              </div>
            </div>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>What's happening?</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the emergency situation"
                          className="resize-none min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Provide as much detail as possible
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="Street address or location description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="contactInfo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Information (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Phone number or other contact info" {...field} />
                      </FormControl>
                      <FormDescription>
                        This will help authorities reach you if needed
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="space-y-2">
                  <FormLabel>Evidence (Optional)</FormLabel>
                  
                  {evidenceList.length > 0 && (
                    <div className="border rounded-md divide-y mb-2">
                      {evidenceList.map((item, index) => (
                        <div key={index} className="p-3 flex items-start justify-between">
                          <div>
                            <div className="font-medium text-sm">{item.file.name}</div>
                            <div className="text-sm text-muted-foreground">{item.description}</div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEvidenceList(evidenceList.filter((_, i) => i !== index))}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <EvidenceUpload onEvidenceAdded={handleEvidenceAdded} />
                </div>
                
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-red-600 hover:bg-red-700"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Emergency Report"
                  )}
                </Button>
              </form>
            </Form>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EmergencyReportForm;
