import { useEffect, useState } from "react";
import "./App.css";
import { useFetch } from "./useFetch";
import axios, { AxiosResponse } from "axios";
import { StoryCard } from "./StoryCard";

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

interface Story {
  id: number;
  loading: boolean;
  error?: Error;
  story?: Item;
}

const App = () => {
  const {
    data: bestStoriesIds,
    loading: bestStoriesIdsLoading,
    error: bestStoriesIdsError,
  } = useFetch<Array<number>>(
    "https://hacker-news.firebaseio.com/v0/topstories.json",
    {
      method: "get",
    }
  );

  const [stories, setStories] = useState<{ [key: number]: Story }>({});

  useEffect(() => {
    bestStoriesIds?.slice(0, 10).map(async (id) => {
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

  console.log("stories", stories);

  return (
    <>
      <h1>Script Kiddie Bulletin</h1>
      {bestStoriesIdsLoading && "loading"}
      {bestStoriesIdsError && bestStoriesIdsError?.message}
      <div id="storyContainer">
        {bestStoriesIds?.slice(0, 10).map((id) => {
          const story = stories[id];
          if (story.loading) return "loading";
          else return <p>{story.story?.title}</p>;
        })}
      </div>
    </>
  );
};

export default App;
