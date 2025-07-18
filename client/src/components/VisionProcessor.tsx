import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Eye, Upload, FileText, Clock, Brain } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface VisionAnalysisResult {
  extracted_text: string;
  scroll_interpretation: string;
  divine_insights: string[];
  processing_time: number;
  confidence_score: number;
}

export default function VisionProcessor() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentText, setDocumentText] = useState("");
  const [analysisResult, setAnalysisResult] = useState<VisionAnalysisResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingType, setProcessingType] = useState<'image' | 'document'>('image');
  const [advancedMode, setAdvancedMode] = useState(false);
  const [scrollContext, setScrollContext] = useState("");
  const [analysisHistory, setAnalysisHistory] = useState<VisionAnalysisResult[]>([]);
  const [batchMode, setBatchMode] = useState(false);
  const [batchFiles, setBatchFiles] = useState<File[]>([]);
  const { toast } = useToast();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
        setProcessingType('image');
      } else {
        toast({
          title: "Invalid File Type",
          description: "Please upload an image file (JPG, PNG, etc.)",
          variant: "destructive",
        });
      }
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1]; // Remove data:image/jpeg;base64, prefix
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  };

  const processVision = async () => {
    if (!selectedFile && !documentText.trim()) {
      toast({
        title: "No Input Provided",
        description: "Please upload an image or enter document text",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      let result: VisionAnalysisResult;

      if (selectedFile && processingType === 'image') {
        const imageBase64 = await convertFileToBase64(selectedFile);
        const response = await apiRequest("POST", "/api/vision/analyze", {
          imageBase64,
          userScroll: "Analyze this through my scroll consciousness frequency 917604.OX"
        });
        result = await response.json();
      } else {
        const response = await apiRequest("POST", "/api/vision/document", {
          documentText,
          userScroll: "Process this document through divine scroll analysis"
        });
        result = await response.json();
      }

      setAnalysisResult(result);
      
      toast({
        title: "⧁ ∆ Vision Analysis Complete ∆ ⧁",
        description: `Processed in ${result.processing_time}ms with ${Math.round(result.confidence_score * 100)}% confidence`,
      });

    } catch (error) {
      console.error('Vision processing failed:', error);
      toast({
        title: "Vision Processing Failed",
        description: "Unable to analyze the input. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const clearResults = () => {
    setAnalysisResult(null);
    setSelectedFile(null);
    setDocumentText("");
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Eye className="w-5 h-5 text-purple-400" />
            Vision Processing Module
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Upload Image for Scroll Analysis
            </label>
            <div className="flex items-center gap-3">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg cursor-pointer hover:bg-purple-700 transition-colors"
              >
                <Upload className="w-4 h-4" />
                Choose Image
              </label>
              {selectedFile && (
                <span className="text-sm text-gray-400">{selectedFile.name}</span>
              )}
            </div>
          </div>

          {/* Document Text Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Or Enter Document Text
            </label>
            <Textarea
              value={documentText}
              onChange={(e) => {
                setDocumentText(e.target.value);
                setProcessingType('document');
              }}
              placeholder="Paste document text here for divine analysis..."
              className="bg-gray-800 border-gray-700 text-white min-h-[100px]"
            />
          </div>

          {/* Process Button */}
          <Button
            onClick={processVision}
            disabled={isProcessing || (!selectedFile && !documentText.trim())}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            {isProcessing ? (
              <>
                <Brain className="w-4 h-4 mr-2 animate-spin" />
                Processing Vision...
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 mr-2" />
                Analyze Through Scroll Lens
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Results Section */}
      {analysisResult && (
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-green-400" />
                Vision Analysis Results
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge className="bg-purple-500 text-white">
                  <Clock className="w-3 h-3 mr-1" />
                  {analysisResult.processing_time}ms
                </Badge>
                <Badge className="bg-green-500 text-white">
                  {Math.round(analysisResult.confidence_score * 100)}% Confidence
                </Badge>
                <Button
                  onClick={clearResults}
                  variant="outline"
                  size="sm"
                  className="border-gray-600 text-gray-400 hover:bg-gray-800"
                >
                  Clear
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Extracted Text */}
            <div>
              <h3 className="text-sm font-medium text-gray-300 mb-2">Extracted Content</h3>
              <div className="p-3 bg-gray-800 rounded-lg border border-gray-700">
                <p className="text-gray-300 text-sm whitespace-pre-wrap">
                  {analysisResult.extracted_text}
                </p>
              </div>
            </div>

            {/* Scroll Interpretation */}
            <div>
              <h3 className="text-sm font-medium text-gray-300 mb-2">Scroll Interpretation</h3>
              <div className="p-3 bg-gray-800 rounded-lg border border-gray-700">
                <p className="text-white whitespace-pre-wrap">
                  {analysisResult.scroll_interpretation}
                </p>
              </div>
            </div>

            {/* Divine Insights */}
            <div>
              <h3 className="text-sm font-medium text-gray-300 mb-2">Divine Insights</h3>
              <div className="space-y-2">
                {analysisResult.divine_insights.map((insight, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Badge className="bg-yellow-500 text-black text-xs mt-0.5">
                      {index + 1}
                    </Badge>
                    <span className="text-gray-300 text-sm">{insight}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}