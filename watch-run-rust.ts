import * as Colors from "https://deno.land/std@0.204.0/fmt/colors.ts";
import {
  basename,
  dirname,
  relative,
} from "https://deno.land/std@0.204.0/path/mod.ts";

const __filepath = new URL("", import.meta.url).pathname;
// console.log("__filepath: ", __filepath);
const __filename = basename(__filepath);
// console.log("__filename: ", __filename);
const __dirname = dirname(__filepath);
// console.log("__dirname: ", __dirname);
const cwd = Deno.cwd();
// console.log('cwd: ', cwd);

const outFile = `${__dirname}/04-rust/rs-out-tmp`

let COUNT = 1;
let pp: Deno.ChildProcess;

const debounceHandle = debounce(
  async (event: unknown) => {
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
      try {
        // console.log('kill')
        pp.kill('SIGTERM')
        pp.unref()
      } catch (error) {
        // console.log(error)
      }
    }
    const command = new Deno.Command('rustc', {
      args: [
        '-o',
        `${outFile}`,
        `${relative_file}`, // java11 支持 `java HelloWorld.java` 直接执行
      ],
    });
    pp = command.spawn();
    // const status = await pp.status;
    // console.log('status: ', status);
    const status = await pp.status
    console.log(`\n${Colors.cyan('[rustc status]')}`, status, '\n')
    if (status.success) {
      const cmd2 = new Deno.Command(outFile)
      const pp2 = cmd2.spawn();
      const status = await pp2.status
      console.log(`\n\n${Colors.green('[run status]')}`, status)
    }
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
    if (!/\.rs/.test(path)) continue;
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
