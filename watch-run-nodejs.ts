import * as Colors from "https://deno.land/std@0.183.0/fmt/colors.ts";
import {
  basename,
  dirname,
  relative,
} from "https://deno.land/std@0.183.0/path/mod.ts";

const __filepath = new URL("", import.meta.url).pathname;
// console.log("__filepath: ", __filepath);
const __filename = basename(__filepath);
// console.log("__filename: ", __filename);
const __dirname = dirname(__filepath);
// console.log("__dirname: ", __dirname);
const cwd = Deno.cwd();
// console.log('cwd: ', cwd);

let COUNT = 1;
let pp: Deno.Process;

const debounceHandle = debounce(
  (event: unknown) => {
    const {
      paths: [path],
    } = event as Deno.FsEvent;

    // console.log("path: ", path);
    const filename = basename(path);
    // console.log("filename: ", filename);
    const relative_file = relative(cwd, path);
    // console.log("relative_file: ", relative_file);
    try {
      Deno.lstatSync(relative_file);
    } catch (err) {
      // console.log('err: ', err);
      if (err instanceof Deno.errors.NotFound) {
        return false;
      }
    }

    console.log(
      `\n${Colors.red("[" + (COUNT++) + "] reload")} ${relative_file}: \n`,
    );
    if (pp) {
      pp.kill('SIGTERM')
      pp.close()
    }
    pp = Deno.run({
      cmd: [
        `node`,
        `${relative_file}`,
      ],
    });
    // console.log(pp);
  },
  100,
  true,
);

async function run() {
  const watcher = Deno.watchFs(".");
  for await (const event of watcher) {
    // console.log(event);
    const {
      kind,
      paths: [path],
    } = event;
    if (
      ![
        // "create",
        "modify",
      ].includes(kind)
    ) {
      continue;
    }
    if (!/\.m?js/.test(path)) continue;
    debounceHandle(event);
  }
}

console.log("start");
run();

function debounce(
  func: (...args: unknown[]) => unknown,
  wait: number,
  fireAtHead = false,
) {
  let timeout: number | undefined;
  return (...args: unknown[]) => {
    const later = () => {
      timeout = undefined;
      if (!fireAtHead) func(...args);
    };
    const needCall = fireAtHead && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (needCall) func(...args);
  };
}
