import { useEffect, useState } from "react";
import "./App.css";
import { useFetch } from "./useFetch";
import axios from "axios";
import { StoryCard } from "./StoryCard";
import iconUrl from "./assets/icon.png";

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

const badPartialWords = ["large language model", "llm", "genai", "openai"];

// const badSingleWords = ["ai", "llm"];

const urls = {
  top: "https://hacker-news.firebaseio.com/v0/topstories.json",
  best: "https://hacker-news.firebaseio.com/v0/beststories.json",
  new: "https://hacker-news.firebaseio.com/v0/newstories.json",
};

const App = () => {
  const [selectedUrl, setSelectedUrl] = useState<"top" | "best" | "new">("top");
  const [stories, setStories] = useState<{ [key: number]: Story }>({});
  const [readStories, setReadStories] = useState<number[]>([]);

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
  }, []);

  useEffect(() => {
    bestStoriesIds
      // ?.slice(0, 10)
      ?.map(async (id) => {
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

  return (
    <>
      <div id="titleContainer">
        <img src={iconUrl} height={32} />
        <span>Script Kiddie Bulletin</span>
        <span
          onClick={() => {
            setSelectedUrl("new");
          }}
        >
          {selectedUrl === "new" ? "new" : <b>new</b>}
        </span>
        <span onClick={() => setSelectedUrl("best")}>
          {selectedUrl === "best" ? "best" : <b>best</b>}
        </span>
        <span onClick={() => setSelectedUrl("top")}>
          {selectedUrl === "top" ? "top" : <b>top</b>}
        </span>
      </div>
      {bestStoriesIdsError ? (
        bestStoriesIdsError?.message
      ) : (
        <div id="storyContainer">
          {bestStoriesIds
            ?.filter(
              (id) => stories[id] && (stories[id].story || stories[id].loading)
            )
            .filter(
              (id) =>
                !badPartialWords.some(
                  (word) =>
                    stories[id].story &&
                    stories[id].story.title?.toLowerCase().includes(word)
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
