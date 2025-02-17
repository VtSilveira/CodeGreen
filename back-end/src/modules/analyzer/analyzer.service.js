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
    try {
      const filePath = await this.saveFile(code, language);
      const runCommandPrefix = `perf stat -e power/energy-pkg/ -e power/energy-cores/ -e power/energy-ram/`;

      switch (language) {
        case this.languages.c:
          return this.analyzeCompiledCode(
            `gcc ${filePath} -o ${filePath.replace(".c", ".out")} -O2`,
            `${runCommandPrefix} ${filePath.replace(".c", ".out")}`
          ).catch((err) => ({ error: "Erro na análise C", details: err }));

        case this.languages.cpp:
          return this.analyzeCompiledCode(
            `g++ ${filePath} -o ${filePath.replace(".cpp", ".out")} -O2`,
            `${runCommandPrefix} ${filePath.replace(".cpp", ".out")}`
          ).catch((err) => ({ error: "Erro na análise C++", details: err }));

        case this.languages.java:
          return this.analyzeCompiledCode(
            `javac ${filePath}`,
            `${runCommandPrefix} java -cp ${path.dirname(filePath)} Main`
          ).catch((err) => ({ error: "Erro na análise Java", details: err }));

        case this.languages.python:
          return this.analyzeInterpretedCode(
            `${runCommandPrefix} python3 ${filePath}`
          ).catch((err) => ({
            error: "Erro na análise Python",
            details: err,
          }));

        case this.languages.javascript:
          return this.analyzeInterpretedCode(
            `${runCommandPrefix} node ${filePath}`
          ).catch((err) => ({
            error: "Erro na análise JavaScript",
            details: err,
          }));

        default:
          return this.analyzeDefault(filePath).catch((err) => ({
            error: "Erro na análise",
            details: err,
          }));
      }
    } catch (error) {
      console.error("Erro inesperado:", error);
      return { error: "Erro inesperado", details: error };
    }
  }

  analyzeCompiledCode(compileCommand, runCommand) {
    try {
      return new Promise((resolve, reject) => {
        exec(compileCommand, (error, _, stderr) => {
          if (error) {
            console.error(`Erro na compilação: ${stderr}`);
            return reject({ error: "Erro na compilação", details: stderr });
          }

          exec(runCommand, (runError, _, runStderr) => {
            if (runError) {
              console.error(`Erro na execução: ${runStderr}`);

              return reject({
                error: "Erro na execução",
                details: runStderr,
              });
            }

            resolve({ output: runStderr });
          });
        });
      });
    } catch (err) {
      console.log(err);
    }
  }

  analyzeInterpretedCode(runCommand) {
    console.log("runcmd:", runCommand);

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

          resolve({ output: runStderr });
        });
      });
    } catch (err) {
      console.log(err);
    }
  }

  async analyzeWithAI(code, perfResults, language) {
    console.log("perfResults:", perfResults);
    console.log("code:", code);

    try {
      const prompt = `You are an specialist in code analyzis. I will send a code, it's language and some energy usage metrics obtained with the perf tool running the code sent. Then, I want you to make an analyzis of the impact on the following topics: Energy consumption, Hardware impact, Usage of resources of the code and Code efficienty.<code>${code}</code><language>${language}</language><perfAnalyzis>${perfResults.output}<perfAnalyzis>`;

      const response = await ollama.chat({
        model: "deepseek-r1:1.5b",
        messages: [{ role: "user", content: prompt }],
      });

      console.log(response.message.content);
    } catch (error) {
      console.error(
        "Erro na requisição:",
        error.response?.data || error.message
      );
    }
  }
}

export default AnalyzerService;
