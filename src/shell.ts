import shell from "shelljs";

async function runShellCmd(cmd: string) {
  return new Promise((resolve, reject) => {
    shell.exec(`wsl ${cmd}`, async (code, stdout, stderr) => {
      if (!code) {
        return resolve(stdout);
      }
      return reject(stderr);
    });
  });
}

const data = await runShellCmd("ls")
console.log("data", data);