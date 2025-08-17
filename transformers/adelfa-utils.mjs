import { readFileSync } from "fs";
import { join } from 'path';

export const removeExtraSubgoals = (s) => {
  const output = [];
  let subgoalCount = 0;

  for (const line of s.split("\n")) {
    if (/^Subgoal/.test(line.trim())) {
      subgoalCount++;
    }
    if (subgoalCount <= 1) {
      output.push(line);
    }
  }

  const outputString = output.join("\n").trim();

  if (subgoalCount > 1) {
    return `${outputString}\n\n% ${subgoalCount - 1} remaining subgoal${
      subgoalCount - 1 > 1 ? "s" : ""
    }`;
  }

  return outputString;
};

const getOutputParts = (s) => {
  if (!s.startsWith("\n\n")) {
    s = "\n\n" + s;
  }
  const parts = [];
  let i = 0;
  let inString = false;
  let curr = "";
  while (i < s.length) {
    // Look for an input command, which starts on a new line.
    if (s[i] === "\n") {
      curr += s[i];
      i++;
      const l = s.substring(i);
      // If adelfa is looking for input, keep eating the input until we reach
      // the end of the command.

      let match = l.match(/^(.*)>>/);
      if (match) {
        parts.push(curr);
        const m = match[0] ? [...match[0].matchAll(/\./g)].length + 1 : 1;
        curr = "";
        let dotCount = 0;
        while (s[i] !== undefined && dotCount < m) {
          if (s[i] === '"') {
            inString = !inString;
          }
          if (s[i] === "." && !inString) {
            dotCount++;
          }
          i++;
        }
        continue;
      }
      continue;
    }
    curr += s[i];
    i++;
  }
  parts.push(curr);
  return parts.map((p) => removeExtraSubgoals(p.trim()));
};

export function shouldShowOutputAdelfa(options) {
  return (
    options.lang === "adelfa" && options.meta?.__raw?.includes("showOutput")
  );
}

export function outputListing(code, options) {
  const listingFile = options.meta?.__raw?.match(/outputFile="(.*?)"/);
  const mdxDir = options.meta?.__raw?.match(/__mdxDir="(.*?)"/)?.[1];

  const codeListing = code.match(/%{(.*)}%/s);
  if (!(codeListing && codeListing[1]) && !(listingFile && listingFile[1])) {
    const filename = options.meta?.__raw?.match(/filename="(.*?)"/)[1];
    const errorMessage = [
      "Cannot find output for code block marked as evaluated",
      ...(filename ? [`Code filename: ${filename}`] : []),
      ...(mdxDir ? [`Code block located in ${mdxDir}`] : []),
    ];
    throw new Error(errorMessage.join('\n'));
  }
  if (codeListing && listingFile) {
    throw new Error(
      `Adelfa code output can be provided either inline within '%{' '}%' or by providing the output file in metadata with the 'outputFile' key, but not both.`,
    );
  }
  if (codeListing && codeListing[1]) {
    return {
      code: code.replace(/%{.*}%/s, "").trim(),
      outputParts: getOutputParts(codeListing[1]),
    };
  } else {
    // Resolve the file path relative to the MDX file
    const filePath = mdxDir ? join(mdxDir, listingFile[1]) : listingFile[1];
    const listingString = readFileSync(filePath, "utf-8");
    return {
      code,
      outputParts: getOutputParts(listingString),
    };
  }
}
