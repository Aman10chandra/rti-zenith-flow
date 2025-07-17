import { useEffect, useState } from "react";
import { Download, Calendar, Building, Languages, MapPin, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { getRTIList, downloadRTI, findOffices } from "@/api/rtiapi"; // ✅ API integration

const RTIDashboard = () => {
  const [locationSearch, setLocationSearch] = useState('');
  const [rtiList, setRtiList] = useState<any[]>([]);
  const [offices, setOffices] = useState<string[]>([]);

  useEffect(() => {
    const loadRTIs = async () => {
      try {
        const response = await getRTIList();
        setRtiList(response.data.rtis);
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to load RTI data",
          variant: "destructive"
        });
      }
    };

    loadRTIs();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'received': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'overdue': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const handleDownload = async (filename: string) => {
    try {
      const response = await downloadRTI(filename);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      toast({
        title: "Download Started",
        description: `Downloading ${filename}`,
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Could not download the file",
        variant: "destructive"
      });
    }
  };

  const handleFindOffices = async () => {
    if (!locationSearch.trim()) {
      toast({
        title: "Enter Location",
        description: "Please enter a location to find RTI offices",
        variant: "destructive"
      });
      return;
    }

    try {
      const response = await findOffices(locationSearch);
      setOffices(response.data.offices || []);
      toast({
        title: "Offices Found",
        description: `Showing RTI offices near ${locationSearch}`,
      });
    } catch (error) {
      toast({
        title: "Search Failed",
        description: "No RTI offices found",
        variant: "destructive"
      });
    }
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
          {offices.length > 0 && (
            <ul className="mt-2 text-sm text-slate-600 list-disc list-inside">
              {offices.map((office, i) => (
                <li key={i}>{office}</li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* RTI Applications Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rtiList.map((rti) => (
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

      {rtiList.length === 0 && (
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
