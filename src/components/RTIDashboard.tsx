
import { useState } from "react";
import { Download, Calendar, Building, Languages, MapPin, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

const RTIDashboard = () => {
  const [locationSearch, setLocationSearch] = useState('');
  
  // Mock RTI data
  const rtis = [
    {
      id: 1,
      filename: "education_budget_rti_2024.pdf",
      timestamp: "2024-01-15",
      language: "English",
      department: "Ministry of Education",
      status: "Submitted",
      responseStatus: "Pending"
    },
    {
      id: 2,
      filename: "health_scheme_rti_2024.pdf",
      timestamp: "2024-01-10",
      language: "Hindi",
      department: "Ministry of Health",
      status: "Submitted",
      responseStatus: "Received"
    },
    {
      id: 3,
      filename: "infrastructure_rti_2023.pdf",
      timestamp: "2023-12-20",
      language: "English",
      department: "Ministry of Railways",
      status: "Submitted",
      responseStatus: "Overdue"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'received': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'overdue': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const handleDownload = (filename: string) => {
    // Simulate download API call to /rtis/{filename}
    toast({
      title: "Download Started",
      description: `Downloading ${filename}`,
    });
  };

  const handleFindOffices = () => {
    if (!locationSearch.trim()) {
      toast({
        title: "Enter Location",
        description: "Please enter a location to find RTI offices",
        variant: "destructive"
      });
      return;
    }
    
    // Simulate API call to /find-offices
    toast({
      title: "Finding Offices",
      description: `Searching for RTI offices near ${locationSearch}`,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-700 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            Your RTI History
          </h1>
          <p className="text-lg text-slate-600">
            Track and manage your RTI applications
          </p>
        </div>
        
        <Button
          onClick={() => window.location.href = '/'}
          className="mt-4 md:mt-0 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl shadow-lg"
        >
          <Plus className="mr-2 h-4 w-4" />
          New RTI Application
        </Button>
      </div>

      {/* RTI Office Finder */}
      <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl mb-8">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-slate-700">
            <MapPin className="h-5 w-5 text-blue-600" />
            <span>Find RTI Offices</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              value={locationSearch}
              onChange={(e) => setLocationSearch(e.target.value)}
              placeholder="Enter your location (city, district, state)"
              className="border-slate-300 focus:border-blue-400 rounded-xl"
            />
            <Button
              onClick={handleFindOffices}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6"
            >
              Find Offices
            </Button>
          </div>
          <p className="text-sm text-slate-500 mt-2">
            Use this to find RTI offices when no response is received within 30 days
          </p>
        </CardContent>
      </Card>

      {/* RTI Applications Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rtis.map((rti) => (
          <Card key={rti.id} className="bg-white/70 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg text-slate-700 line-clamp-2">
                  {rti.filename.replace('.pdf', '').replace(/_/g, ' ').toUpperCase()}
                </CardTitle>
                <Badge className={`${getStatusColor(rti.responseStatus)} border text-xs`}>
                  {rti.responseStatus}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-slate-500" />
                  <span className="text-slate-600">{new Date(rti.timestamp).toLocaleDateString()}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Building className="h-4 w-4 text-slate-500" />
                  <span className="text-slate-600 text-xs">{rti.department}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Languages className="h-4 w-4 text-slate-500" />
                  <span className="text-slate-600">{rti.language}</span>
                </div>
              </div>
              
              <Button
                onClick={() => handleDownload(rti.filename)}
                variant="outline"
                size="sm"
                className="w-full border-slate-300 hover:border-purple-400 hover:bg-purple-50 rounded-xl"
              >
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {rtis.length === 0 && (
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
          <CardContent className="text-center py-12">
            <div className="text-slate-400 mb-4">
              <Calendar className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">No RTI Applications Yet</h3>
            <p className="text-slate-600 mb-6">Start by creating your first RTI application</p>
            <Button
              onClick={() => window.location.href = '/'}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create First RTI
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RTIDashboard;
