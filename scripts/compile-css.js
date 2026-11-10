/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");
const { compile } = require("@tailwindcss/node");
const { Scanner } = require("@tailwindcss/oxide");

async function buildCss() {
  const root = process.cwd();
  const sourcePath = path.join(root, "app", "globals.source.css");
  const targetPath = path.join(root, "app", "globals.css");

  const css = fs.readFileSync(sourcePath, "utf8");

  const scanner = new Scanner({
    sources: [
      {
        base: root,
        pattern: "{app,components,context}/**/*.{tsx,ts,jsx,js}",
        negated: false,
      },
    ],
  });

  const candidates = scanner.scan();

  const compiler = await compile(css, {
    base: root,
    onDependency: () => {},
  });

  const compiledCss = compiler.build(candidates);

  fs.writeFileSync(targetPath, compiledCss, "utf8");
  console.log(
    `[Tailwind Build] Successfully compiled ${candidates.length} class candidates into ${targetPath} (${(compiledCss.length / 1024).toFixed(1)} KB)`,
  );
}

buildCss().catch((err) => {
  console.error("[Tailwind Build Error]", err);
  process.exit(1);
});
