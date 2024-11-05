import { Item } from "./App";

type StoryCardProps = {
  story: Item;
};

export const StoryCard = ({ story }: StoryCardProps) => {
  console.log(story);
  return (
    <div>
      <p>{story.title ?? "No title"}</p>
    </div>
  );
};
