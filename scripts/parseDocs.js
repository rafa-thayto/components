/* eslint-disable @typescript-eslint/no-var-requires */
const { readdirSync, readFileSync, writeFileSync } = require('fs');
const pkg = require('../package.json');
// ============================================================================

readdirSync('./dist')
  .filter((filePath) => filePath.endsWith('.mdx'))
  .map((filePath) => {
    const fileContentDirty = readFileSync(`./dist/${filePath}`, 'utf8');
    let lock = true;
    const fileLines = [];

    fileContentDirty.split('\n').forEach((line) => {
      if (line.includes('@lib/components')) {
        fileLines.push(line.replace('@lib/components', pkg.name));
        fileLines.push('\n');
      }
      if (line.startsWith('# ')) lock = false;
      if (lock) return;
      fileLines.push(line);
    });

    return {
      filePath,
      fileContent: fileLines.join('\n'),
    };
  })
  .forEach(({ filePath, fileContent }) => {
    writeFileSync(`./dist/${filePath}`, fileContent, 'utf8');
  });
