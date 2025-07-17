
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Send, Mail, MapPin, Languages, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";

interface FinalizePageProps {
  draftData: any;
}

const FinalizePage = ({ draftData }: FinalizePageProps) => {
  const navigate = useNavigate();
  const [pioEmail, setPioEmail] = useState('');
  const [location, setLocation] = useState('');
  const [language, setLanguage] = useState<'english' | 'hindi'>('english');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSending, setIsSending] = useState(false);

  if (!draftData) {
    navigate('/');
    return null;
  }

  const handleSubmit = async () => {
    setIsSending(true);
    
    try {
      // Simulate API call to /finalize-and-send
      setTimeout(() => {
        toast({
          title: "RTI Submitted Successfully!",
          description: "Your RTI has been sent. Reminder set for 30 days.",
        });
        setIsSending(false);
        navigate('/dashboard');
      }, 2000);
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Please try again later",
        variant: "destructive"
      });
      setIsSending(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-700 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
          Finalize & Send RTI
        </h1>
        <p className="text-lg text-slate-600">
          Review your application and provide submission details
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Preview Card */}
        <div className="lg:col-span-2">
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-slate-700">
                <span>Final Draft Preview</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-slate-600 hover:text-slate-800"
                >
                  {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  {isExpanded ? 'Collapse' : 'Expand'}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`bg-slate-50 rounded-xl p-6 overflow-y-auto transition-all duration-300 ${
                isExpanded ? 'max-h-96' : 'max-h-48'
              }`}>
                <pre className="whitespace-pre-wrap text-slate-700 leading-relaxed font-sans text-sm">
                  {draftData[language]}
                </pre>
              </div>
              
              <div className="mt-4 flex items-center space-x-2">
                <Languages className="h-4 w-4 text-slate-600" />
                <span className="text-sm text-slate-600">Language:</span>
                <div className="flex items-center space-x-2">
                  <span className={`text-sm ${language === 'english' ? 'font-medium text-purple-600' : 'text-slate-500'}`}>
                    English
                  </span>
                  <Switch
                    checked={language === 'hindi'}
                    onCheckedChange={(checked) => setLanguage(checked ? 'hindi' : 'english')}
                  />
                  <span className={`text-sm ${language === 'hindi' ? 'font-medium text-purple-600' : 'text-slate-500'}`}>
                    हिंदी
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Submission Form */}
        <div className="space-y-6">
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-slate-700">
                <Mail className="h-5 w-5 text-purple-600" />
                <span>Submission Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  PIO Email (Optional)
                </label>
                <Input
                  type="email"
                  value={pioEmail}
                  onChange={(e) => setPioEmail(e.target.value)}
                  placeholder="pio@ministry.gov.in"
                  className="border-slate-300 focus:border-purple-400 rounded-xl"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Leave empty for automatic office detection
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <MapPin className="inline h-4 w-4 mr-1" />
                  Location
                </label>
                <Input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter your city/district"
                  className="border-slate-300 focus:border-purple-400 rounded-xl"
                />
                <p className="text-xs text-slate-500 mt-1">
                  For fallback office search if needed
                </p>
              </div>
            </CardContent>
          </Card>

          <Button
            onClick={handleSubmit}
            disabled={isSending}
            className="w-full py-4 text-lg font-semibold bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            {isSending ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                <span>Sending...</span>
              </div>
            ) : (
              <>
                <Send className="mr-2 h-5 w-5" />
                Submit & Schedule Follow-up
              </>
            )}
          </Button>

          <p className="text-xs text-center text-slate-500">
            A follow-up reminder will be automatically set for 30 days from submission
          </p>
        </div>
      </div>
    </div>
  );
};

export default FinalizePage;
