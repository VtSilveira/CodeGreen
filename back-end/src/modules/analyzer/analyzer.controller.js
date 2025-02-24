import AnalyzerService from "./analyzer.service.js";

class AnalyzerController {
  constructor() {
    this.analyzerService = new AnalyzerService();
  }

  analyze = async (req, res) => {
    const { code, language } = req.body;

    const perfAnalyzis = await this.analyzerService.analyzeWithPerf(
      code,
      language
    );

    const AIAnalyzis = await this.analyzerService.analyzeWithAI(
      code,
      perfAnalyzis.energy,
      perfAnalyzis.resources,
      language
    );

    return res.status(200).json({ perfAnalyzis, AIAnalyzis });
  };
}

export default AnalyzerController;
