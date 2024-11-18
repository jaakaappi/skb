import { useEffect, useState } from "react";
import "./App.css";
import { useFetch } from "./useFetch";
import axios from "axios";
import { StoryCard } from "./StoryCard";
import iconUrl from "./assets/icon.png";
import gearUrl from "./assets/gear.png";
import { Settings } from "./Settings";

export interface Item {
  by?: string;
  descendants?: number;
  id?: number;
  kids?: Array<number>;
  score?: number;
  time?: number;
  title?: string;
  type?: "story" | "job" | "poll" | "pollopt" | "comment";
  url?: string;
}

export interface Story {
  id: number;
  loading: boolean;
  error?: Error;
  story?: Item;
}

const initialBadPartialWords = [
  "bert",
  "embedding",
  "genai",
  "language model",
  "large language model",
  "llama",
  "llm",
  "machine learning",
  "neural network",
  "ollama",
  "openai",
];

const initialBadWholeWords = ["ai", "llm", "rag", "ml"];

const urls = {
  top: "https://hacker-news.firebaseio.com/v0/topstories.json",
  best: "https://hacker-news.firebaseio.com/v0/beststories.json",
  new: "https://hacker-news.firebaseio.com/v0/newstories.json",
};

const App = () => {
  const [selectedUrl, setSelectedUrl] = useState<"top" | "best" | "new">("top");
  const [stories, setStories] = useState<{ [key: number]: Story }>({});
  const [readStories, setReadStories] = useState<number[]>([]);
  const [currentPartialWords, setCurrentPartialWords] = useState<string[]>(
    initialBadPartialWords
  );
  const [currentWholeWords, setCurrentWholeWords] =
    useState<string[]>(initialBadWholeWords);

  const [settingsVisible, setSettingsVisible] = useState(false);

  const {
    data: bestStoriesIds,
    error: bestStoriesIdsError,
    refetch,
  } = useFetch<Array<number>>(urls[selectedUrl], {
    method: "get",
  });

  useEffect(() => {
    refetch();
  }, [selectedUrl]);

  useEffect(() => {
    const savedReadStories = (
      localStorage.getItem("readStories")
        ? JSON.parse(localStorage.getItem("readStories")!)
        : { stories: [] }
    )["stories"] as Array<number>;
    setReadStories(savedReadStories);

    const savedPartialWords =
      localStorage.getItem("partialWords")?.split("\n") ?? [];
    const newPartialWords =
      savedPartialWords.length === 0
        ? initialBadPartialWords
        : savedPartialWords;
    setCurrentPartialWords(newPartialWords);
    // save back in case there were no values saved
    localStorage.setItem("partialWords", newPartialWords.join("\n"));

    const savedWholeWords =
      localStorage.getItem("wholeWords")?.split("\n") ?? [];
    const newWholeWords =
      savedWholeWords.length === 0 ? initialBadWholeWords : savedWholeWords;
    setCurrentWholeWords(newWholeWords);
    // save back in case there were no values saved
    localStorage.setItem("wholeWords", newWholeWords.join("\n"));
  }, []);

  useEffect(() => {
    bestStoriesIds?.map(async (id) => {
      setStories((previousStories) => ({
        ...previousStories,
        [id]: { id, loading: true },
      }));

      try {
        const response = await axios.get(
          `https://hacker-news.firebaseio.com/v0/item/${id}.json`
        );
        setStories((previousStories) => ({
          ...previousStories,
          [id]: {
            id,
            loading: false,
            story: response.data as unknown as Item,
          },
        }));
      } catch (error) {
        setStories((previousStories) => ({
          ...previousStories,
          [id]: { id, loading: false, error: error as Error },
        }));
      }
    });
  }, [bestStoriesIds]);

  const handleCardOpened = (id: number) => {
    const readStories = (
      localStorage.getItem("readStories")
        ? JSON.parse(localStorage.getItem("readStories")!)
        : { stories: [] }
    )["stories"] as Array<number>;

    if (readStories.includes(id)) return;

    const newStories = {
      stories: [...readStories, id],
    };
    setReadStories([...readStories, id]);
    localStorage.setItem("readStories", JSON.stringify(newStories));
  };

  const handleSettingsChanged = (
    partialWords?: string[],
    wholeWords?: string[]
  ) => {
    setSettingsVisible(false);
    if (partialWords) {
      const cleanerPartialWords = partialWords
        .map((word) => word.trim())
        .filter((word) => word);
      setCurrentPartialWords(cleanerPartialWords);
      localStorage.setItem("wholeWords", cleanerPartialWords.join("\n"));
    }
    if (wholeWords) {
      const cleanerWholeWords = wholeWords
        .map((word) => word.trim())
        .filter((word) => word);
      setCurrentWholeWords(cleanerWholeWords);
      localStorage.setItem("wholeWords", cleanerWholeWords.join("\n"));
    }
  };

  return (
    <>
      <div id="titleContainer">
        <img src={iconUrl} height={32} />
        <span>Script Kiddie Bulletin</span>
        <span
          onClick={() => {
            setSelectedUrl("new");
          }}
          className="hoverCursor"
        >
          {selectedUrl === "new" ? "new" : <b>new</b>}
        </span>
        <span onClick={() => setSelectedUrl("best")} className="hoverCursor">
          {selectedUrl === "best" ? "best" : <b>best</b>}
        </span>
        <span onClick={() => setSelectedUrl("top")} className="hoverCursor">
          {selectedUrl === "top" ? "top" : <b>top</b>}
        </span>
        <img
          id="titleGearIcon"
          className="hoverCursor"
          src={gearUrl}
          height={24}
          onClick={() => setSettingsVisible(!settingsVisible)}
        />
      </div>
      {settingsVisible && (
        <Settings
          onClose={handleSettingsChanged}
          partialWords={currentPartialWords}
          wholeWords={currentWholeWords}
        />
      )}
      {bestStoriesIdsError ? (
        `Error getting story ids: ${bestStoriesIdsError?.message}`
      ) : (
        <div id="storyContainer">
          {bestStoriesIds
            ?.filter(
              (id) => stories[id] && (stories[id].story || stories[id].loading)
            )
            .filter(
              (id) =>
                !currentPartialWords.some(
                  (word) =>
                    stories[id].story &&
                    stories[id].story.title
                      ?.toLowerCase()
                      .includes(word.toLowerCase())
                ) &&
                !currentWholeWords.some(
                  (word) =>
                    stories[id].story &&
                    stories[id].story.title
                      ?.toLowerCase()
                      .split(" ")
                      .some((titleWord) => titleWord === word.toLowerCase())
                )
            )
            .map(
              (id) =>
                stories[id] && (
                  <StoryCard
                    story={stories[id]}
                    onOpened={() => handleCardOpened(id)}
                    read={readStories.includes(id)}
                  />
                )
            )}
        </div>
      )}
    </>
  );
};

export default App;
