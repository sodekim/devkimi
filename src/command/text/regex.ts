import { invoke } from "@tauri-apps/api/core";

interface Match {
  start: number;
  end: number;
  value: string;
}
type Capture = Match[];

const parseRegex = async (
  text: string,
  pattern: string,
  global: boolean,
  multiLine: boolean,
  caseInsensitive: boolean,
) => {
  return invoke<Capture[]>("parse_regex", {
    text,
    pattern,
    global,
    multiLine,
    caseInsensitive,
  });
};

export { parseRegex };
export type { Capture, Match };
