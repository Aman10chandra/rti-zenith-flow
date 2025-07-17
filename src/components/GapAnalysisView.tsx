
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Table, Languages, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface GapAnalysisData {
  rawGaps: string;
  structuredGaps: {
    gap: string;
    category: string;
    priority: string;
  }[];
  drafts: {
    english: string;
    hindi: string;
  };
}

interface GapAnalysisViewProps {
  analysisData: GapAnalysisData | null;
  setDraftData: (data: GapAnalysisData["drafts"]) => void;
}

const GapAnalysisView = ({ analysisData, setDraftData }: GapAnalysisViewProps) => {
  const navigate = useNavigate();
  const [data, setData] = useState<GapAnalysisData | null>(analysisData);

  // ✅ Step 3.2: Read from localStorage if not passed directly (e.g., on page refresh)
  useEffect(() => {
    if (!data) {
      const stored = localStorage.getItem("gap-analysis");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setData(parsed);
        } catch (err) {
          navigate("/");
        }
      } else {
        navigate("/");
      }
    }
  }, [data, navigate]);

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  const handleContinue = () => {
    if (data) {
      setDraftData(data.drafts);
      navigate("/edit");
    }
  };

  if (!data) return null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-700 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
          Gap Analysis Results
        </h1>
        <p className="text-lg text-slate-600">
          Review the identified information gaps and generated RTI drafts
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-2 text-slate-700">
              <FileText className="h-5 w-5 text-purple-600" />
              <span>Raw Gap Analysis</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-80 overflow-y-auto bg-slate-50 rounded-xl p-4 text-slate-700 leading-relaxed">
              {data.rawGaps}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center space-x-2 text-slate-700">
              <Table className="h-5 w-5 text-blue-600" />
              <span>Structured Gaps</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {data.structuredGaps.map((gap, index) => (
                <div
                  key={index}
                  className="p-4 bg-slate-50 rounded-xl border border-slate-200 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-slate-800">{gap.gap}</h4>
                    <Badge className={`${getPriorityColor(gap.priority)} border`}>
                      {gap.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600">{gap.category}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl mb-8">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-2 text-slate-700">
            <Languages className="h-5 w-5 text-green-600" />
            <span>Initial RTI Drafts</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="english" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-slate-100 rounded-xl">
              <TabsTrigger value="english" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                English
              </TabsTrigger>
              <TabsTrigger value="hindi" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
                हिंदी
              </TabsTrigger>
            </TabsList>

            <TabsContent value="english">
              <div className="bg-slate-50 rounded-xl p-6 max-h-80 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-slate-700 leading-relaxed font-sans">
                  {data.drafts.english}
                </pre>
              </div>
            </TabsContent>

            <TabsContent value="hindi">
              <div className="bg-slate-50 rounded-xl p-6 max-h-80 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-slate-700 leading-relaxed font-sans">
                  {data.drafts.hindi}
                </pre>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="text-center">
        <Button
          onClick={handleContinue}
          className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          Continue to Editing Options
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default GapAnalysisView;
