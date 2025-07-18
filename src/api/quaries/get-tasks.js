import { gql } from '@apollo/client';

export const GET_TASKS = gql`
  query GetTasks {
    tasks {
      id
      name
      minPlayerLevel
      trader {
        name
        imageLink
      }
      kappaRequired
      lightkeeperRequired
      wikiLink
      taskImageLink
      map {
        name
      }
      objectives {
        type
        maps {
          normalizedName
        }
        ... on TaskObjectiveItem {
          items {
            name
            image512pxLink
          }
          count
          foundInRaid
        }
      }
    }
    hideoutStations {
      id
      name
      levels {
        id
        level
        itemRequirements {
          count
          item {
            image512pxLink
            name
          }
        }
      }
    }
    playerLevels {
      level
      exp
    }
  }
`;