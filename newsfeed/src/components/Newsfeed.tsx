import * as React from "react";
import Story from "./Story";

import { graphql } from "relay-runtime";
import { useLazyLoadQuery, usePaginationFragment } from "react-relay";

import type { NewsfeedQuery as NewsfeedQueryType } from "./__generated__/NewsfeedQuery.graphql";
import { NewsfeedContentsFragment$key } from "./__generated__/NewsfeedContentsFragment.graphql";
import InfiniteScrollTrigger from "./InfiniteScrollTrigger";

const NewsfeedQuery = graphql`
  query NewsfeedQuery {
    ...NewsfeedContentsFragment
  }
`;

const NewsfeedContentsFragment = graphql`
  fragment NewsfeedContentsFragment on Query
  @argumentDefinitions(
    cursor: { type: "String" }
    count: { type: "Int", defaultValue: 3 }
  )
  @refetchable(queryName: "NewsfeedContentsRefetchQuery") {
    viewer {
      newsfeedStories(after: $cursor, first: $count)
        @connection(key: "NewsfeedContentsFragment_newsfeedStories") {
        edges {
          node {
            id
            ...StoryFragment
          }
        }
      }
    }
  }
`;

export default function Newsfeed() {
  const data = useLazyLoadQuery<NewsfeedQueryType>(NewsfeedQuery, {});

  return (
    <div className="newsfeed">
      <NewsfeedContents viewer={data} />
    </div>
  );
}

function NewsfeedContents({
  viewer,
}: {
  viewer: NewsfeedContentsFragment$key;
}) {
  const { data, loadNext, hasNext, isLoadingNext } = usePaginationFragment(
    NewsfeedContentsFragment,
    viewer
  );
  function onEndReached() {
    loadNext(3);
  }
  const storyEdges = data.viewer.newsfeedStories.edges;
  return (
    <>
      {storyEdges.map((storyEdge) => (
        <Story key={storyEdge.node.id} story={storyEdge.node} />
      ))}
      <InfiniteScrollTrigger
        onEndReached={onEndReached}
        hasNext={hasNext}
        isLoadingNext={isLoadingNext}
      />
    </>
  );
}
