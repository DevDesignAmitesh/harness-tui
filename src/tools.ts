import fs from "fs";
import fs_promise from "fs/promises";
import shell from "shelljs";

export type Tools = {
  id: string;
  name: string;
  description: string;
  params: unknown;
  function: (input: unknown) => unknown;
};

function readCurrentDir() {
  const data = fs.readdirSync(process.cwd());

  return {
    message: "read current dir successfull",
    data,
  };
}

function readFile(file: unknown) {
  console.log("READ FILE", file);

  if (
    file.input === ".git" ||
    file.input === ".vscode" ||
    file.input === "node_modules"
  )
    return;
  const data = fs.readFileSync(file.input).toString();
  return {
    message: `read file: ${file.input} successfull`,
    data,
  };
}

function writeFile(file: string, data: any) {
  fs.writeFileSync(file, data);
  return {
    message: `write file: ${file} successfull`,
  };
}

// async function deleteFile(file: unknown) {
//   await fs_promise.rm(`./${file.input}`, { recursive: true, force: true });
//   return {
//     message: `write file: ${file.input} successfull`,
//   };
// }

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

export const TOOLS: Tools[] = [
  {
    id: "1",
    name: "read_current_dir",
    function: readCurrentDir,
    params: null,
    description:
      "this is the tool used to read all the files and folder or the current working dir",
  },
  {
    id: "2",
    name: "read_file",
    function: (file) => readFile(file),
    params: {
      input: "string",
    },
    description:
      "this is the tool used for reading the data of the particular file, which required a file_name as an input",
  },
  // {
  //   id: "3",
  //   name: "delete_file_or_folder",
  //   function: (file) => deleteFile(file),
  //   params: {
  //     input: "string",
  //   },
  //   description:
  //     "this is the tool used for deleting a file or folder, which required a file_name or folder_name as an input",
  // },
  {
    id: "3",
    name: "run_shell_cmd",
    function: (params) => runShellCmd(params.cmd),
    params: {
      cmd: "string",
    },
    description:
      "this the tool for running shell commands, which requires users access.",
  },
  {
    id: "4",
    name: "write_file",
    function: (params) => writeFile(params.file, params.data),
    params: {
      file: "string",
      data: "string",
    },
    description:
      "this is the tool used for writing into the given folder and file, it requires three params which are folder, file and data",
  },
];
