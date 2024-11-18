import { Story } from "./App";

type StoryCardProps = {
  story: Story;
  onOpened: () => void;
  read: boolean;
};

export const StoryCard = ({ story, onOpened, read }: StoryCardProps) => {
  const formatTimestamp = (timestamp: number) => {
    const microsecondTimestamp = timestamp * 1000;
    const difference = Date.now() - microsecondTimestamp;

    if (difference >= 1000 * 60 * 60 * 24)
      return `on ${new Date(microsecondTimestamp).toLocaleDateString()}`;
    else if (difference >= 1000 * 60 * 60)
      return `${new Date(difference).getHours()} hours ago`;
    else return `${new Date(difference).getMinutes()} minutes ago`;
  };

  return (
    <div
      className={read ? "storyCardContainer visiterCard" : "storyCardContainer"}
    >
      {!story.loading && story.story ? (
        <>
          <div className="storyCardTitleContainer">
            <a
              href={`https://news.ycombinator.com/item?id=${story.id}`}
              target="_blank"
              onClick={onOpened}
              className="storyCardTitleText"
            >
              {story.story.title}
            </a>
            {story.story.url && (
              <a
                href={story.story.url}
                target="_blank"
                onClick={onOpened}
                className="storyCardUrlText"
              >{`(${new URL(story.story.url).hostname})`}</a>
            )}
          </div>
          <div className="storyCardInfoContainer">
            <span>{`${story.story.score} points`}</span>
            {story.story.time && (
              <span>{`${formatTimestamp(story.story.time)}`}</span>
            )}
            <a
              href={`https://news.ycombinator.com/item?id=${story.id}`}
              target="_blank"
              onClick={onOpened}
            >{`${story.story.descendants} comments`}</a>
          </div>
        </>
      ) : (
        "loading"
      )}
    </div>
  );
};
