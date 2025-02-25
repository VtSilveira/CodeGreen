import fs from "fs/promises";
import path from "path";
import { v4 } from "uuid";
import { exec } from "child_process";
import ollama from "ollama";

class AnalyzerService {
  languages = {
    c: "c",
    cpp: "cpp",
    java: "java",
    python: "python",
    javascript: "javascript",
  };

  extensions = {
    c: "c",
    cpp: "cpp",
    java: "java",
    python: "py",
    javascript: "js",
  };

  resolveExtension(language) {
    return this.extensions[language] || "txt";
  }

  async saveFile(code, language) {
    try {
      const projectDir = path.resolve(
        path.dirname(new URL(import.meta.url).pathname),
        "../../.."
      );

      const filePath = path.join(
        projectDir,
        "tmp",
        `${
          language != this.languages.java ? v4() : "Main"
        }.${this.resolveExtension(language)}`
      );

      await fs.writeFile(filePath, code);

      return filePath;
    } catch (err) {
      console.log(err);
    }
  }

  async analyzeWithPerf(code, language) {
    console.log("Entering analysis with perf...");

    try {
      const filePath = await this.saveFile(code, language);
      const runCommandPrefixForEnergy = `perf stat -e power/energy-pkg/ -e power/energy-cores/ -e power/energy-ram/`;
      const runCommandPrefixForPerformance = `perf stat -e cycles -e instructions -e cache-references -e cache-misses -e context-switches -e cpu-migrations -e page-faults -e task-clock`;

      switch (language) {
        case this.languages.c:
          return this.analyzeCompiledCode(
            `gcc ${filePath} -o ${filePath.replace(".c", ".out")} -O2`,
            `${runCommandPrefixForEnergy} ${filePath.replace(".c", ".out")}`,
            `${runCommandPrefixForPerformance} ${filePath.replace(
              ".c",
              ".out"
            )}`
          ).catch((err) => ({ error: "Erro na análise C", details: err }));

        case this.languages.cpp:
          return this.analyzeCompiledCode(
            `g++ ${filePath} -o ${filePath.replace(".cpp", ".out")} -O2`,
            `${runCommandPrefixForEnergy} ${filePath.replace(".cpp", ".out")}`,
            `${runCommandPrefixForPerformance} ${filePath.replace(
              ".cpp",
              ".out"
            )}`
          ).catch((err) => ({ error: "Erro na análise C++", details: err }));

        case this.languages.java:
          return this.analyzeCompiledCode(
            `javac ${filePath}`,
            `${runCommandPrefixForEnergy} java -cp ${path.dirname(
              filePath
            )} Main`,
            `${runCommandPrefixForPerformance} java -cp ${path.dirname(
              filePath
            )} Main`
          ).catch((err) => ({ error: "Erro na análise Java", details: err }));

        case this.languages.python:
          return this.analyzeInterpretedCode(
            `${runCommandPrefixForEnergy} python3 ${filePath}`,
            `${runCommandPrefixForPerformance} python3 ${filePath}`
          ).catch((err) => ({
            error: "Erro na análise Python",
            details: err,
          }));

        case this.languages.javascript:
          return this.analyzeInterpretedCode(
            `${runCommandPrefixForEnergy} node ${filePath}`,
            `${runCommandPrefixForPerformance} node ${filePath}`
          ).catch((err) => ({
            error: "Erro na análise JavaScript",
            details: err,
          }));

        default:
          return {
            error: "Erro na análise",
          };
      }
    } catch (error) {
      console.error("Erro inesperado:", error);
      return { error: "Erro inesperado", details: error };
    }
  }

  analyzeCompiledCode(
    compileCommand,
    runCommandForEnergy,
    runCommandForPerformance
  ) {
    try {
      return new Promise((resolve, reject) => {
        exec(compileCommand, (error, _, stderr) => {
          if (error) {
            console.error(`Erro na compilação: ${stderr}`);
            return reject({ error: "Erro na compilação", details: stderr });
          }

          console.log("Successfully compiled code.");

          exec(runCommandForEnergy, (runError, _, runEnergyStderr) => {
            if (runError) {
              console.error(`Erro na execução: ${runEnergyStderr}`);

              return reject({
                error: "Erro na execução",
                details: runEnergyStderr,
              });
            }

            console.log("Successfully ran code for energy measurement.");

            exec(
              runCommandForPerformance,
              (runPerfError, _, runPerformanceStderr) => {
                if (runPerfError) {
                  console.error(`Erro na execução: ${runPerformanceStderr}`);

                  return reject({
                    error: "Erro na execução",
                    details: runPerformanceStderr,
                  });
                }

                console.log(
                  "Successfully ran code for performance measurement."
                );

                resolve({
                  energy: runEnergyStderr,
                  resources: runPerformanceStderr,
                });
              }
            );
          });
        });
      });
    } catch (err) {
      console.log(err);
    }
  }

  analyzeInterpretedCode(runCommand, runCommandPerf) {
    try {
      return new Promise((resolve, reject) => {
        exec(runCommand, (runError, _, runStderr) => {
          if (runError) {
            console.error(`Erro na execução: ${runStderr}`);

            return reject({
              error: "Erro na execução",
              details: runStderr,
            });
          }

          console.log("Successfully ran code for energy measurement.");

          exec(runCommandPerf, (runPerfError, _, runPerfStderr) => {
            if (runPerfError) {
              console.error(`Erro na execução: ${runPerfStderr}`);

              return reject({
                error: "Erro na execução",
                details: runPerfStderr,
              });
            }

            console.log("Successfully ran code for performance measurement.");

            resolve({ energy: runStderr, resources: runPerfStderr });
          });
        });
      });
    } catch (err) {
      console.log(err);
    }
  }

  async analyzeWithAI(
    code,
    perfResultsForEnergy,
    perfResultsForResourceUsage,
    language
  ) {
    try {
      const prompt = `
You are an expert in code performance analysis, specializing in evaluating energy consumption, hardware impact, and resource efficiency.  
I will provide you with:  
1. The source code.  
2. The programming language used.  
3. Performance metrics collected using the Linux tool "perf," including **energy consumption** and **resource usage**.  

Your task is to **analyze the impact of the code** based on the following key aspects:  
- **Energy Consumption**: How much power the code consumes and possible optimizations.  
- **Hardware Impact**: How the code interacts with CPU, memory, and cache.  
- **Resource Usage**: Efficiency in using CPU cycles, cache hits/misses, context switching, and memory access.  
- **Code Efficiency**: Possible optimizations to improve performance while reducing energy consumption.  

### **Data for Analysis**  
**Code:**  
<code>${code}</code>  

**Language:**  
<language>${language}</language>  

**Energy Analysis from perf:**  
<perfEnergyAnalysis>${perfResultsForEnergy}</perfEnergyAnalysis>  

**Resource Usage from perf:**  
<perfResourceUsage>${perfResultsForResourceUsage}</perfResourceUsage>  

### **Instructions for the Analysis**  
- The analysis **must be focused in sustentability and performance**. Also known as Green Software Engineering.
- Provide **clear insights** about the impact of the code on energy and performance.  
- If inefficiencies are detected, **suggest improvements** with reasoning.  
- If the programming language affects performance, **explain why**.  
- Structure your response using **titles, bullet points, and examples** if necessary.  
- Keep it **technical and professional**, but easy to understand.  

Now, analyze the provided data and deliver a detailed report.
`;

      console.log("Running AI Analyzis...");

      const response = await ollama.chat({
        model: "deepseek-r1:1.5b",
        messages: [{ role: "user", content: prompt }],
      });

      console.log(response.message.content);

      return response.message.content;
    } catch (error) {
      console.error(
        "Erro na requisição:",
        error.response?.data || error.message
      );
    }
  }
}

export default AnalyzerService;
