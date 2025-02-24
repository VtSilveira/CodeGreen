import ReactMarkdown from "react-markdown";
import "../style/results.css";

const AIAnalysis = ({ analyzis }) => {
  if (!analyzis) return <p>Carregando análise da IA...</p>;

  const cleanedAnalysis = analyzis.replace(/<think>.*?<\/think>/gs, "").trim();

  return (
    <div className="ai-section">
      <h2>Análise da Inteligência Artificial</h2>
      <div className="ai-container">
        <ReactMarkdown>{cleanedAnalysis}</ReactMarkdown>
      </div>
    </div>
  );
};

export default AIAnalysis;
