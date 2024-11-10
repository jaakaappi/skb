import { useState } from "react";

interface SettingsProps {
  onClose: (partialWords?: string[], wholeWords?: string[]) => void;
  partialWords: string[];
  wholeWords: string[];
}

export const Settings = ({
  onClose,
  partialWords,
  wholeWords,
}: SettingsProps) => {
  const [currentPartialWords, setCurrentPartialWords] =
    useState<string[]>(partialWords);
  const [currentWholeWords, setCurrentWholeWords] =
    useState<string[]>(wholeWords);

  return (
    <div id="settingsContainer">
      <div className="settingsFieldContainer">
        <div className="settingsTextboxContainer">
          <span>
            Partial words, don't need to match whole word e.g. "llm" matches
            "llm:s". Word per line
          </span>
          <textarea
            className="settingsTextbox"
            value={currentPartialWords.join("\n")}
            style={{ height: `${currentPartialWords.length * 15}px` }}
            onChange={(event) =>
              setCurrentPartialWords(event.target.value.split("\n"))
            }
          />
        </div>
        <div className="settingsTextboxContainer">
          <span>
            Words like "AI" which need to be matched to whole words to limit
            mismatches. Word per line
          </span>
          <textarea
            className="settingsTextbox"
            value={currentWholeWords.join("\n")}
            style={{ height: `${currentWholeWords.length * 15}px` }}
            onChange={(event) =>
              setCurrentWholeWords(event.target.value.split("\n"))
            }
          />
        </div>
      </div>
      <b
        className="hoverCursor"
        onClick={() => onClose(currentPartialWords, currentWholeWords)}
      >
        close
      </b>
    </div>
  );
};
