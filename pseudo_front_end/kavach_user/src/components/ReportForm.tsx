
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Check, Files, X } from "lucide-react"; // Added X import here
import { Crime, CrimeType } from "@/types";
import { submitCrime } from "@/utils/api";
import EvidenceUpload from "./EvidenceUpload";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Define the schema for report validation
const reportSchema = z.object({
  type: z.nativeEnum(CrimeType),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }).max(500, {
    message: "Description must not exceed 500 characters.",
  }),
  date: z.string().min(1, {
    message: "Please select a date.",
  }),
  time: z.string().min(1, {
    message: "Please enter a time.",
  }),
});

type ReportFormValues = z.infer<typeof reportSchema>;

interface ReportFormProps {
  selectedLocation?: {
    lat: number;
    lng: number;
    address?: string;
  };
  onSubmitSuccess?: (crime: Crime) => void;
}

const ReportForm = ({ selectedLocation, onSubmitSuccess }: ReportFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("details");
  const [evidenceList, setEvidenceList] = useState<{
    file: File;
    description: string;
  }[]>([]);
  const { toast } = useToast();
  
  // Get today's date in yyyy-MM-dd format
  const today = new Date().toISOString().split('T')[0];
  
  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      type: CrimeType.OTHER,
      description: "",
      date: today,
      time: new Date().toTimeString().slice(0, 5),
    },
  });
  
  const handleEvidenceAdded = (evidence: { file: File; description: string }) => {
    setEvidenceList((prev) => [...prev, evidence]);
    toast({
      title: "Evidence Added",
      description: "Your evidence has been added to the report.",
    });
  };
  
  const onSubmit = async (values: ReportFormValues) => {
    if (!selectedLocation) {
      toast({
        variant: "destructive",
        title: "Location Required",
        description: "Please select a location on the map first.",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const crimeData = {
        type: values.type,
        description: values.description,
        date: values.date,
        time: values.time,
        location: selectedLocation,
        evidence: evidenceList.map(item => ({
          fileUrl: URL.createObjectURL(item.file), // In real app, this would be an IPFS/cloud URL
          fileType: item.file.type,
          description: item.description,
          timestamp: new Date().toISOString(),
        })),
      };
      
      const result = await submitCrime(crimeData);
      
      toast({
        title: "Report Submitted",
        description: `Your crime report with ${evidenceList.length} pieces of evidence has been successfully submitted.`,
        action: (
          <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center">
            <Check className="h-5 w-5 text-white" />
          </div>
        ),
      });
      
      // Reset form
      form.reset({
        type: CrimeType.OTHER,
        description: "",
        date: today,
        time: new Date().toTimeString().slice(0, 5),
      });
      setEvidenceList([]);
      
      // Notify parent component
      if (onSubmitSuccess) {
        onSubmitSuccess(result);
      }
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
      <CardContent className="pt-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="details">Report Details</TabsTrigger>
            <TabsTrigger 
              value="evidence" 
              className="relative"
            >
              Evidence
              {evidenceList.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs w-4 h-4 rounded-full flex items-center justify-center">
                  {evidenceList.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="details">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type of Incident</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select the type of incident" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.values(CrimeType).map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Provide a detailed description of the incident"
                            className="resize-none min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Provide as much detail as possible about the incident
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date of Incident</FormLabel>
                          <FormControl>
                            <Input type="date" max={today} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="time"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Time of Incident</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div>
                    <FormLabel>Location</FormLabel>
                    <div className="p-3 bg-secondary rounded-md">
                      {selectedLocation ? (
                        <div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <span className="font-medium mr-1">Coordinates:</span>
                            <span>
                              {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                            </span>
                          </div>
                          {selectedLocation.address && (
                            <div className="mt-1 text-sm">
                              <span className="font-medium mr-1">Address:</span>
                              <span>{selectedLocation.address}</span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          Please select a location on the map first.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setActiveTab("evidence")}
                    className="flex items-center gap-2"
                  >
                    <Files className="h-4 w-4" />
                    Add Evidence
                  </Button>
                  
                  <Button 
                    type="submit" 
                    disabled={isSubmitting || !selectedLocation}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Report"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>
          
          <TabsContent value="evidence">
            <div className="space-y-4">
              {evidenceList.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Added Evidence ({evidenceList.length})</h3>
                  <div className="border rounded-md divide-y">
                    {evidenceList.map((item, index) => (
                      <div key={index} className="p-3 flex items-start justify-between">
                        <div>
                          <div className="font-medium text-sm">{item.file.name}</div>
                          <div className="text-sm text-muted-foreground">{item.description}</div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEvidenceList(evidenceList.filter((_, i) => i !== index));
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <EvidenceUpload onEvidenceAdded={handleEvidenceAdded} />
              
              <div className="flex justify-between pt-2">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setActiveTab("details")}
                >
                  Back to Details
                </Button>
                
                <Button 
                  onClick={() => {
                    form.handleSubmit(onSubmit)();
                    setActiveTab("details");
                  }}
                  disabled={isSubmitting || !selectedLocation || !!form.formState.errors.type || !!form.formState.errors.description}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Report"
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ReportForm;
