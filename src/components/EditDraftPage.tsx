
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Edit3, Bot, CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";

interface EditDraftPageProps {
  draftData: any;
  setDraftData: (data: any) => void;
}

const EditDraftPage = ({ draftData, setDraftData }: EditDraftPageProps) => {
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState<'manual' | 'ai' | 'asis'>('manual');
  const [currentDraft, setCurrentDraft] = useState(draftData?.english || '');
  const [aiInstruction, setAiInstruction] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [language, setLanguage] = useState<'english' | 'hindi'>('english');

  if (!draftData) {
    navigate('/');
    return null;
  }

  const handleAIEdit = async () => {
    if (!aiInstruction.trim()) {
      toast({
        title: "Missing Instruction",
        description: "Please provide instructions for AI editing",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulate API call to /edit-draft
      setTimeout(() => {
        const improvedDraft = `${currentDraft}\n\nAI Enhancement: ${aiInstruction}`;
        setCurrentDraft(improvedDraft);
        setIsProcessing(false);
        toast({
          title: "Draft Updated",
          description: "AI has successfully improved your draft",
        });
      }, 2000);
    } catch (error) {
      toast({
        title: "Edit Failed",
        description: "Please try again later",
        variant: "destructive"
      });
      setIsProcessing(false);
    }
  };

  const handleFinalize = () => {
    const finalData = {
      ...draftData,
      [language]: currentDraft,
      editMode
    };
    setDraftData(finalData);
    navigate('/finalize');
  };

  const EditModeCard = ({ mode, icon: Icon, title, description, isSelected, onClick }: any) => (
    <Card 
      className={`cursor-pointer transition-all duration-300 border-2 ${
        isSelected 
          ? 'border-purple-400 bg-purple-50/50 shadow-lg scale-105' 
          : 'border-slate-200 hover:border-purple-300 hover:shadow-md bg-white/70'
      } backdrop-blur-sm`}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2">
          <Icon className={`h-5 w-5 ${isSelected ? 'text-purple-600' : 'text-slate-600'}`} />
          <span className={isSelected ? 'text-purple-700' : 'text-slate-700'}>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-slate-600">{description}</p>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-700 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
          Edit & Improve Draft
        </h1>
        <p className="text-lg text-slate-600">
          Choose how you'd like to refine your RTI application
        </p>
      </div>

      {/* Edit Mode Selection */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <EditModeCard
          mode="manual"
          icon={Edit3}
          title="Edit Draft Myself"
          description="Manually edit and customize your RTI application"
          isSelected={editMode === 'manual'}
          onClick={() => setEditMode('manual')}
        />
        
        <EditModeCard
          mode="ai"
          icon={Bot}
          title="Give AI an Instruction"
          description="Let AI improve your draft based on your instructions"
          isSelected={editMode === 'ai'}
          onClick={() => setEditMode('ai')}
        />
        
        <EditModeCard
          mode="asis"
          icon={CheckCircle}
          title="Use as-is"
          description="Continue with the current draft without changes"
          isSelected={editMode === 'asis'}
          onClick={() => setEditMode('asis')}
        />
      </div>

      {/* Content Area */}
      <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl mb-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-slate-700">RTI Draft Editor</CardTitle>
            <Tabs value={language} onValueChange={(value: any) => setLanguage(value)}>
              <TabsList className="bg-slate-100 rounded-xl">
                <TabsTrigger value="english" className="rounded-lg">English</TabsTrigger>
                <TabsTrigger value="hindi" className="rounded-lg">हिंदी</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {editMode === 'manual' && (
            <div>
              <Textarea
                value={currentDraft}
                onChange={(e) => setCurrentDraft(e.target.value)}
                className="min-h-80 border-slate-300 focus:border-purple-400 rounded-xl"
                placeholder="Edit your RTI draft here..."
              />
            </div>
          )}

          {editMode === 'ai' && (
            <div className="space-y-4">
              <div>
                <Input
                  value={aiInstruction}
                  onChange={(e) => setAiInstruction(e.target.value)}
                  placeholder="e.g., Make it more formal, add specific dates, include legal references..."
                  className="border-slate-300 focus:border-purple-400 rounded-xl"
                />
                <Button
                  onClick={handleAIEdit}
                  disabled={isProcessing}
                  className="mt-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl"
                >
                  {isProcessing ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    "Improve with AI"
                  )}
                </Button>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 max-h-80 overflow-y-auto">
                <pre className="whitespace-pre-wrap text-slate-700 leading-relaxed font-sans">
                  {currentDraft}
                </pre>
              </div>
            </div>
          )}

          {editMode === 'asis' && (
            <div className="bg-slate-50 rounded-xl p-6 max-h-80 overflow-y-auto">
              <pre className="whitespace-pre-wrap text-slate-700 leading-relaxed font-sans">
                {draftData[language]}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="text-center">
        <Button
          onClick={handleFinalize}
          className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          Finalize RTI Application
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default EditDraftPage;
