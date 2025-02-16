import fs from "fs/promises";
import path from "path";
import { v4 } from "uuid";
import { exec } from "child_process";

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
          return this.analyzePython(filePath).catch((err) => ({
            error: "Erro na análise Python",
            details: err,
          }));

        case this.languages.javascript:
          return this.analyzeJavascript(filePath).catch((err) => ({
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
}

export default AnalyzerService;
