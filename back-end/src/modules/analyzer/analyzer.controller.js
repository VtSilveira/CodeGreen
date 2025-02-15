class AnalyzerController {
  constructor() {
    // this.analyzerService = new AnalyzerService();
  }

  async analyze(req, res) {
    const { code, language } = req.body;

    console.log({ code, language });

    return res.status(200).json({ code, language });
  }
}

export default AnalyzerController;
