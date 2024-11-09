import { Story } from "./App";

type StoryCardProps = {
  story: Story;
  onOpened: () => void;
  read: boolean;
};

export const StoryCard = ({ story, onOpened, read }: StoryCardProps) => {
  return (
    <div
      className={read ? "storyCardContainer visiterCard" : "storyCardContainer"}
    >
      {!story.loading && story.story ? (
        <div>
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
            <a
              href={`https://news.ycombinator.com/item?id=${story.id}`}
              target="_blank"
              onClick={onOpened}
            >{`${story.story.descendants} comments`}</a>
          </div>
        </div>
      ) : (
        "loading"
      )}
    </div>
  );
};