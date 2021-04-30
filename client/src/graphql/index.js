import { gql } from '@apollo/client';

export const USER_SEARCH = gql`
  query GetUsersBySearch($query: String!) {
    getUsersBySearch(query: $query) {
      id
      name
      handle
      bio
      location
      is_verified
      album_count
      followee_count
      follower_count
      playlist_count
      repost_count
      track_count
      cover_photo {
        x2000
      }
      profile_picture {
        x150
      }
    }
  }
`;

export const USER_BY_ID = gql`
  query GetUserById($userId: ID!) {
    getUserById(userId: $userId) {
      id
      name
      handle
      bio
      location
      is_verified
      album_count
      followee_count
      follower_count
      playlist_count
      repost_count
      track_count
      cover_photo {
        x2000
      }
      profile_picture {
        x150
      }
    }
  }
`;
