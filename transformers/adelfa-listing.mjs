const PROMPT = /^[ \t]*[^\s>]*[ \t]*>>(?:[ \t]|$)/gm;
const INLINE_OUTPUT = /^[ \t]*%\{([\s\S]*)\}%[ \t]*$/m;

export function removeExtraSubgoals(output) {
  const lines = output.split("\n");
  const subgoalLines = lines.flatMap((line, i) =>
    /^Subgoal/.test(line.trim()) ? [i] : [],
  );
  if (subgoalLines.length <= 1) return output.trim();

  const extra = subgoalLines.length - 1;
  const noun = extra > 1 ? "subgoals" : "subgoal";
  return `${lines.slice(0, subgoalLines[1]).join("\n").trim()}\n\n% ${extra} remaining ${noun}`;
}

export function parseListing(listing) {
  const prompts = [...listing.matchAll(PROMPT)];
  return prompts.flatMap((prompt, i) => {
    const bodyStart = prompt.index + prompt[0].length;
    const bodyEnd = prompts[i + 1]?.index ?? listing.length;
    const body = listing.slice(bodyStart, bodyEnd);
    const [command] = findStatements(body);
    if (!command) return [];
    const commandEnd = body.indexOf(command.text) + command.text.length;
    return [
      { command: command.text, output: removeExtraSubgoals(body.slice(commandEnd)) },
    ];
  });
}

export function splitInlineOutput(code) {
  const match = code.match(INLINE_OUTPUT);
  if (!match) return { code, listing: null };
  return { code: code.replace(match[0], "").trimEnd(), listing: match[1] };
}

const commentStart = (line) => {
  const index = line.split("").findIndex((ch, i) => {
    const quotes = line.slice(0, i).split('"').length - 1;
    return ch === "%" && quotes % 2 === 0;
  });
  return index === -1 ? line.length : index;
};

export function lineSegments(lines, { start, end }) {
  return lines
    .slice(start.line, end.line + 1)
    .map((text, i) => {
      const line = start.line + i;
      const from = line === start.line ? start.character : 0;
      const to = line === end.line ? end.character : text.length;
      const slice = text.slice(from, to).slice(0, commentStart(text.slice(from, to)));
      const leading = slice.length - slice.trimStart().length;
      const trimmed = slice.trimEnd();
      return {
        start: { line, character: from + leading },
        end: { line, character: from + trimmed.length },
      };
    })
    .filter((segment) => segment.start.character < segment.end.character);
}

export function findStatements(source) {
  const statements = [];
  const position = { line: 0, character: 0 };
  let index = 0;
  let start = null;
  let inString = false;

  const advance = () => {
    if (source[index] === "\n") {
      position.line += 1;
      position.character = 0;
    } else {
      position.character += 1;
    }
    index += 1;
  };

  while (index < source.length) {
    const ch = source[index];
    if (!inString && ch === "%") {
      while (index < source.length && source[index] !== "\n") advance();
      continue;
    }
    if (start === null && /\s/.test(ch)) {
      advance();
      continue;
    }
    start ??= { ...position, offset: index };
    if (ch === '"') inString = !inString;
    const endsStatement = ch === "." && !inString;
    advance();
    if (endsStatement) {
      statements.push({
        start: { line: start.line, character: start.character },
        end: { ...position },
        text: source.slice(start.offset, index),
      });
      start = null;
    }
  }

  return statements;
}
