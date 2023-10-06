import * as React from "react";
import {
  useLazyLoadQuery,
  useFragment,
  usePreloadedQuery,
  PreloadedQuery,
} from "react-relay";
import { graphql } from "relay-runtime";
import Image from "./Image";
import Timestamp from "./Timestamp";

import type { PosterDetailsHovercardContentsQuery as QueryType } from "./__generated__/PosterDetailsHovercardContentsQuery.graphql";
import type { PosterDetailsHovercardContentsBodyFragment$key } from "./__generated__/PosterDetailsHovercardContentsBodyFragment.graphql";
import OrganizationKind from "./OrganizationKind";

// The node field is a top-level field defined in our schema that lets us fetch any graph node given its unique ID
// .. on Actor is a type refinement
export const PosterDetailsHovercardContentsQuery = graphql`
  query PosterDetailsHovercardContentsQuery($posterID: ID!) {
    node(id: $posterID) {
      ... on Actor {
        ...PosterDetailsHovercardContentsBodyFragment
      }
    }
  }
`;

// With preloaded queries, the variables are actually determined when the query is fetched,
// which will be before this component is even rendered.
// So instead of variables, this hook takes a query reference that contains the information it needs to retrieve the results of the query
export default function PosterDetailsHovercardContents({
  queryRef,
}: {
  queryRef: PreloadedQuery<QueryType>;
}): React.ReactElement {
  const data = usePreloadedQuery(PosterDetailsHovercardContentsQuery, queryRef);

  return (
    <div className="posterHovercard">
      <PosterDetailsHovercardContentsBody poster={data.node} />
    </div>
  );
}

const PosterDetailsHovercardContentsBodyFragment = graphql`
  fragment PosterDetailsHovercardContentsBodyFragment on Actor {
    id
    name
    joined
    profilePicture {
      ...ImageFragment
    }
    ... on Organization {
      organizationKind
    }
    ... on Person {
      location {
        name
      }
    }
  }
`;

function PosterDetailsHovercardContentsBody({
  poster,
}: {
  poster: PosterDetailsHovercardContentsBodyFragment$key;
}) {
  const data = useFragment(PosterDetailsHovercardContentsBodyFragment, poster);
  return (
    <>
      <Image
        image={data.profilePicture}
        width={128}
        height={128}
        className="posterHovercard__image"
      />
      <div className="posterHovercard__name">{data.name}</div>
      <ul className="posterHovercard__details">
        <li>
          Joined <Timestamp time={data.joined} />
        </li>
        {data.location != null && <li>{data.location.name}</li>}
        {data.organizationKind != null && (
          <li>
            <OrganizationKind kind={data.organizationKind} />
          </li>
        )}
      </ul>
      <div className="posterHovercard__buttons">
        <button>Friend</button>
        <button>Message</button>
      </div>
    </>
  );
}
