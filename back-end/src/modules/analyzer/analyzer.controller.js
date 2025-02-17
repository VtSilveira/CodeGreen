import AnalyzerService from "./analyzer.service.js";

class AnalyzerController {
  constructor() {
    this.analyzerService = new AnalyzerService();
  }

  analyze = async (req, res) => {
    const { code, language } = req.body;

    const analyzis = await this.analyzerService.analyzeWithPerf(code, language);

    await this.analyzerService.analyzeWithAI(code, analyzis, language);

    return res.status(200).json({ analyzis });
  };
}

export default AnalyzerController;
