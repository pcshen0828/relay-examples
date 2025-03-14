import * as React from "react";

import { graphql } from "relay-runtime";
import { useFragment, useQueryLoader } from "react-relay";

import { PosterBylineFragment$key } from "./__generated__/PosterBylineFragment.graphql";

import Image from "./Image";
import Hovercard from "./Hovercard";
import PosterDetailsHovercardContents from "./PosterDetailsHovercardContents";

import type { PosterDetailsHovercardContentsQuery as HovercardQueryType } from "./__generated__/PosterDetailsHovercardContentsQuery.graphql";
import { PosterDetailsHovercardContentsQuery } from "./PosterDetailsHovercardContents";

const { useRef } = React;

const PosterBylineFragment = graphql`
  fragment PosterBylineFragment on Actor {
    id
    name
    profilePicture {
      ...ImageFragment @arguments(width: 60, height: 60)
    }
  }
`;

export type Props = {
  poster: PosterBylineFragment$key;
};

export default function PosterByline({ poster }: Props): React.ReactElement {
  const data = useFragment(PosterBylineFragment, poster);
  const hoverRef = useRef(null);

  // the query ref is an opaque piece of information that usePreloadedQuery will use to retrieve the result of the query.
  // loadHovercardQuery is a function that will initiate the request.
  const [hovercardQueryRef, loadHovercardQuery] =
    useQueryLoader<HovercardQueryType>(PosterDetailsHovercardContentsQuery);

  function onBeginHover() {
    loadHovercardQuery({ posterID: data.id });
  }

  return (
    <div className="byline">
      <Image
        image={data.profilePicture}
        width={60}
        height={60}
        className="byline__image"
      />
      <div className="byline__name" ref={hoverRef}>
        {data.name}
      </div>
      <Hovercard onBeginHover={onBeginHover} targetRef={hoverRef}>
        <PosterDetailsHovercardContents queryRef={hovercardQueryRef} />
      </Hovercard>
    </div>
  );
}
