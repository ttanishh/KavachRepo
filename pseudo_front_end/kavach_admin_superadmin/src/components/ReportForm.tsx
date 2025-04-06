
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { AlertTriangle, Loader2, MapPin, Upload, Plus, X, Shield } from "lucide-react";
import { mockSubmitReport } from "@/lib/reportUtils";
import { CrimeCategory, Location } from "@/types/report";

interface Witness {
  description: string;
  contactHash?: string;
}

interface Evidence {
  type: "image" | "video" | "document" | "audio";
  description: string;
}

export function ReportForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<CrimeCategory>("other");
  const [location, setLocation] = useState<Location | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [urgencyLevel, setUrgencyLevel] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [witnesses, setWitnesses] = useState<Witness[]>([]);
  const [newWitness, setNewWitness] = useState("");
  const [evidence, setEvidence] = useState<Evidence[]>([]);
  const [newEvidenceType, setNewEvidenceType] = useState<"image" | "video" | "document" | "audio">("image");
  const [newEvidenceDescription, setNewEvidenceDescription] = useState("");
  
  const getCurrentLocation = () => {
    setIsLoadingLocation(true);
    
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      setIsLoadingLocation(false);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        // In a real app, we would use a service like Google Maps API to reverse geocode
        // For now, we'll just set the coordinates
        const newLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          address: "Your current location" // In production, this would come from reverse geocoding
        };
        
        setLocation(newLocation);
        toast.success("Location detected", {
          description: "Your current location will be included in the report."
        });
        setIsLoadingLocation(false);
      },
      (error) => {
        console.error("Error getting location", error);
        toast.error("Failed to get your location", {
          description: "Please try again or enter location manually."
        });
        setIsLoadingLocation(false);
      }
    );
  };

  const addWitness = () => {
    if (!newWitness.trim()) return;
    
    setWitnesses([...witnesses, { description: newWitness }]);
    setNewWitness("");
    
    toast.success("Witness added", {
      description: "Witness information has been added to your report."
    });
  };

  const removeWitness = (index: number) => {
    setWitnesses(witnesses.filter((_, i) => i !== index));
  };

  const addEvidence = () => {
    if (!newEvidenceDescription.trim()) return;
    
    setEvidence([...evidence, { 
      type: newEvidenceType, 
      description: newEvidenceDescription 
    }]);
    
    setNewEvidenceDescription("");
    
    toast.success("Evidence added", {
      description: "Evidence has been added to your report."
    });
  };

  const removeEvidence = (index: number) => {
    setEvidence(evidence.filter((_, i) => i !== index));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !location) {
      toast.error("Please fill all required fields", {
        description: "Title, description and location are required."
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, this would call our blockchain functions
      // For now, we'll use a mock function
      const result = await mockSubmitReport({
        title,
        description,
        category,
        location,
        timestamp: new Date().toISOString(),
        witnesses: witnesses.length > 0 ? witnesses : undefined,
        evidence: evidence.map(e => ({
          ...e,
          ipfsHash: `ipfs-hash-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date().toISOString()
        })),
        urgencyLevel
      });
      
      toast.success("Report submitted successfully", {
        description: "Your report has been recorded on the blockchain."
      });
      
      // Reset form
      setTitle("");
      setDescription("");
      setCategory("other");
      setLocation(null);
      setUrgencyLevel(3);
      setWitnesses([]);
      setEvidence([]);
      
    } catch (error) {
      console.error("Error submitting report", error);
      toast.error("Failed to submit report", {
        description: "Please try again later."
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="bg-gradient-to-r from-civic-primary to-civic-secondary text-white rounded-t-lg">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6" />
          <CardTitle>KAVACH Crime Report</CardTitle>
        </div>
        <CardDescription className="text-white/90">
          Submit your report securely and anonymously
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2">
            <Label htmlFor="title">Incident Title</Label>
            <Input
              id="title"
              placeholder="Brief title describing the incident"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="border-civic-primary/20 focus-visible:ring-civic-primary"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Crime Category</Label>
            <Select 
              value={category} 
              onValueChange={(value) => setCategory(value as CrimeCategory)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="theft">Theft</SelectItem>
                <SelectItem value="assault">Assault</SelectItem>
                <SelectItem value="vandalism">Vandalism</SelectItem>
                <SelectItem value="fraud">Fraud</SelectItem>
                <SelectItem value="harassment">Harassment</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Provide detailed information about what happened"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              required
              className="border-civic-primary/20 focus-visible:ring-civic-primary"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Location</Label>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={getCurrentLocation}
                className="flex items-center gap-2"
                disabled={isLoadingLocation}
              >
                {isLoadingLocation ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <MapPin className="h-4 w-4" />
                )}
                {location ? "Update Location" : "Use Current Location"}
              </Button>
              
              {location && (
                <span className="text-sm text-muted-foreground">
                  {location.address || `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`}
                </span>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Urgency Level</Label>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5].map((level) => (
                <Button
                  key={level}
                  type="button"
                  variant={urgencyLevel === level ? "default" : "outline"}
                  onClick={() => setUrgencyLevel(level as 1 | 2 | 3 | 4 | 5)}
                  className={`h-10 w-10 rounded-full p-0 ${
                    urgencyLevel === level 
                      ? level <= 2 
                        ? "bg-civic-success" 
                        : level >= 4 
                          ? "bg-civic-alert" 
                          : "bg-civic-pending"
                      : ""
                  }`}
                >
                  {level}
                </Button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              {urgencyLevel <= 2 
                ? "Low urgency - For minor incidents or those that occurred some time ago" 
                : urgencyLevel >= 4 
                  ? "High urgency - For serious incidents requiring immediate attention" 
                  : "Medium urgency - For standard incidents requiring normal processing"}
            </p>
          </div>
          
          <div className="space-y-2">
            <Label>Witnesses (Optional)</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Brief description of witness"
                value={newWitness}
                onChange={(e) => setNewWitness(e.target.value)}
                className="border-civic-primary/20 focus-visible:ring-civic-primary"
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={addWitness}
                disabled={!newWitness.trim()}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
            
            {witnesses.length > 0 && (
              <div className="mt-2 space-y-2">
                {witnesses.map((witness, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                    <span className="text-sm truncate">{witness.description}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeWitness(index)}
                    >
                      <X className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label>Evidence (Optional)</Label>
            <div className="flex flex-col gap-2">
              <div className="grid grid-cols-4 gap-2">
                <div className="col-span-1">
                  <Select 
                    value={newEvidenceType} 
                    onValueChange={(value) => setNewEvidenceType(value as "image" | "video" | "document" | "audio")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="image">Image</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="document">Document</SelectItem>
                      <SelectItem value="audio">Audio</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Input
                    placeholder="Description of evidence"
                    value={newEvidenceDescription}
                    onChange={(e) => setNewEvidenceDescription(e.target.value)}
                    className="border-civic-primary/20 focus-visible:ring-civic-primary"
                  />
                </div>
                <div className="col-span-1">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={addEvidence}
                    disabled={!newEvidenceDescription.trim()}
                    className="w-full"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>
              </div>
              
              <p className="text-xs text-muted-foreground">
                Note: In the full version, you would be able to upload actual files. 
                For this demo, we're just collecting descriptions.
              </p>
            </div>
            
            {evidence.length > 0 && (
              <div className="mt-2 space-y-2">
                {evidence.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-white px-2 py-0.5 rounded bg-civic-primary">
                        {item.type.toUpperCase()}
                      </span>
                      <span className="text-sm truncate">{item.description}</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeEvidence(index)}
                    >
                      <X className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="bg-civic-light p-3 rounded-md flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-civic-primary flex-shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">
              Your identity is protected. Report details will be stored securely on the blockchain, and personal information will not be publicly visible.
            </p>
          </div>
        </CardContent>
        
        <CardFooter className="bg-muted/30 rounded-b-lg">
          <Button
            type="submit"
            className="w-full bg-civic-primary hover:bg-civic-dark"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting Report
              </>
            ) : (
              "Submit Report"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
