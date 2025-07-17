
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, Link, FileText, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { analyzeFromUpload, analyzeFromUrl} from '@/api/rtiapi'



interface UploadInterfaceProps {
  setAnalysisData: (data: any) => void;
}

const UploadInterface = ({ setAnalysisData }: UploadInterfaceProps) => {
  const navigate = useNavigate();
  const [uploadMethod, setUploadMethod] = useState<'file' | 'url'>('file');
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState('');
  const [department, setDepartment] = useState('');
  const [fiscalYear, setFiscalYear] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const departments = [
    "Ministry of Education",
    "Ministry of Health",
    "Ministry of Finance",
    "Ministry of Defence",
    "Ministry of Railways",
    "Ministry of Agriculture"
  ];

  const fiscalYears = ["2024-25", "2023-24", "2022-23", "2021-22", "2020-21"];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile);
      setUploadMethod('file');
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file",
        variant: "destructive"
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setUploadMethod('file');
    }
  };

const handleAnalyze = async () => {
  if (!department || !fiscalYear) {
    toast({
      title: "Missing Information",
      description: "Please select department and fiscal year",
      variant: "destructive"
    });
    return;
  }

  if (uploadMethod === 'file' && !file) {
    toast({
      title: "No File Selected",
      description: "Please upload a PDF file",
      variant: "destructive"
    });
    return;
  }

  if (uploadMethod === 'url' && !url) {
    toast({
      title: "No URL Provided",
      description: "Please enter a government URL",
      variant: "destructive"
    });
    return;
  }

  setIsLoading(true);

  try {
    let result;
    if (uploadMethod === 'file') {
      result = await analyzeFromUpload(file as File, department, fiscalYear);
    } else {
      result = await analyzeFromUrl(url, department, fiscalYear);
    }

    // Save to state and localStorage
    setAnalysisData(result);
    localStorage.setItem("gap-analysis", JSON.stringify(result));

    navigate('/analysis');
  } catch (error) {
    console.error("API error:", error);
    toast({
      title: "Analysis Failed",
      description: "Server error or invalid input. Please try again.",
      variant: "destructive"
    });
  } finally {
    setIsLoading(false);
  }
};


  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-700 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
          Start Your RTI Analysis
        </h1>
        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
          Upload a PDF document or provide a government URL to analyze information gaps and generate your RTI application
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* File Upload Section */}
        <Card className="p-6 bg-white/70 backdrop-blur-sm border-0 shadow-xl">
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-2 mb-4">
              <FileText className="h-5 w-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-slate-700">Upload PDF Document</h3>
            </div>
            
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer ${
                isDragging
                  ? 'border-purple-400 bg-purple-50'
                  : uploadMethod === 'file' && file
                  ? 'border-green-400 bg-green-50'
                  : 'border-slate-300 hover:border-purple-400 hover:bg-purple-50/50'
              }`}
            >
              <Upload className={`h-12 w-12 mx-auto mb-4 ${
                uploadMethod === 'file' && file ? 'text-green-500' : 'text-slate-400'
              }`} />
              {file ? (
                <div>
                  <p className="font-medium text-green-700">{file.name}</p>
                  <p className="text-sm text-green-600">Ready to analyze</p>
                </div>
              ) : (
                <div>
                  <p className="font-medium text-slate-700 mb-2">Drag & drop your PDF here</p>
                  <p className="text-sm text-slate-500">or click to browse files</p>
                </div>
              )}
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="absolute inset-0 cursor-pointer" />
            </div>
          </CardContent>
        </Card>

        {/* URL Input Section */}
        <Card className="p-6 bg-white/70 backdrop-blur-sm border-0 shadow-xl">
          <CardContent className="space-y-6">
            <div className="flex items-center space-x-2 mb-4">
              <Link className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-slate-700">Government URL</h3>
            </div>
            
            <div className="space-y-4">
              <Input
                placeholder="https://example.gov.in/document-url"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  if (e.target.value) setUploadMethod('url');
                }}
                className="border-slate-300 focus:border-blue-400 rounded-xl"
              />
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Department</label>
                  <Select value={department} onValueChange={setDepartment}>
                    <SelectTrigger className="border-slate-300 focus:border-blue-400 rounded-xl">
                      <SelectValue placeholder="Select Department" />
                      <ChevronDown className="h-4 w-4" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept} className="rounded-lg">
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Fiscal Year</label>
                  <Select value={fiscalYear} onValueChange={setFiscalYear}>
                    <SelectTrigger className="border-slate-300 focus:border-blue-400 rounded-xl">
                      <SelectValue placeholder="Select Fiscal Year" />
                      <ChevronDown className="h-4 w-4" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {fiscalYears.map((year) => (
                        <SelectItem key={year} value={year} className="rounded-lg">
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="text-center">
        <Button
          onClick={handleAnalyze}
          disabled={isLoading}
          className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              <span>Analyzing...</span>
            </div>
          ) : (
            "Analyze and Find Gaps"
          )}
        </Button>
      </div>
    </div>
  );
};

export default UploadInterface;
