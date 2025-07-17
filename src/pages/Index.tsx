
import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import UploadInterface from "../components/UploadInterface";
import GapAnalysisView from "../components/GapAnalysisView";
import EditDraftPage from "../components/EditDraftPage";
import FinalizePage from "../components/FinalizePage";
import RTIDashboard from "../components/RTIDashboard";

const Index = () => {
  const [analysisData, setAnalysisData] = useState(null);
  const [draftData, setDraftData] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <Routes>
        <Route path="/" element={<UploadInterface setAnalysisData={setAnalysisData} />} />
        <Route path="/analysis" element={<GapAnalysisView analysisData={analysisData} setDraftData={setDraftData} />} />
        <Route path="/edit" element={<EditDraftPage draftData={draftData} setDraftData={setDraftData} />} />
        <Route path="/finalize" element={<FinalizePage draftData={draftData} />} />
        <Route path="/dashboard" element={<RTIDashboard />} />
      </Routes>
    </div>
  );
};

export default Index;
