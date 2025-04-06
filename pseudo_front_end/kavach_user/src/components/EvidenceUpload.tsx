
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, File, X, Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface EvidenceUploadProps {
  onEvidenceAdded: (evidence: {
    file: File;
    description: string;
  }) => void;
}

const EvidenceUpload = ({ onEvidenceAdded }: EvidenceUploadProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsUploading(true);

    // In a real blockchain implementation, this would include hashing the file
    // and storing the hash on-chain while the file itself could go to IPFS
    setTimeout(() => {
      onEvidenceAdded({
        file: selectedFile,
        description: description,
      });
      setSelectedFile(null);
      setDescription("");
      setIsUploading(false);
    }, 1000); // Simulating upload delay
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">
          Evidence Upload
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {selectedFile ? (
            <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/50">
              <File className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm truncate flex-1">
                {selectedFile.name}
              </span>
              <Badge variant="secondary" className="font-normal">
                {(selectedFile.size / 1024).toFixed(0)} KB
              </Badge>
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="h-6 w-6"
                onClick={() => setSelectedFile(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="grid w-full items-center gap-1.5">
              <label
                htmlFor="evidence-upload"
                className="cursor-pointer text-sm font-medium"
              >
                Select Evidence File
              </label>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="evidence-upload"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-md cursor-pointer bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
                    <p className="mb-1 text-sm text-muted-foreground">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Images, videos, or documents (max. 10MB)
                    </p>
                  </div>
                  <Input
                    id="evidence-upload"
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept="image/*,video/*,.pdf,.doc,.docx"
                  />
                </label>
              </div>
            </div>
          )}

          <div className="grid w-full gap-1.5">
            <label
              htmlFor="evidence-description"
              className="text-sm font-medium"
            >
              Description
            </label>
            <Textarea
              id="evidence-description"
              placeholder="Describe the evidence (when, where, and what it shows)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="resize-none"
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={!selectedFile || description.length < 5 || isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              "Add Evidence"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default EvidenceUpload;
