import AIAnalyzis from "./AIAnalyzis";
import EnergyAnalyzis from "./EnergyAnalyzis";
import PerformanceAnalyzis from "./PerformanceAnalyzis";

const ResultSection = ({ results }) => {
  return (
    <div>
      {results ? (
        <div>
          <EnergyAnalyzis analyzis={results.perfAnalyzis.energy} />
          <PerformanceAnalyzis analyzis={results.perfAnalyzis.resources} />
          <AIAnalyzis analyzis={results.AIAnalyzis} />
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default ResultSection;
