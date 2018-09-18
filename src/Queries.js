import { gql } from "apollo-boost";

export const GET_MESSAGES = gql`
  {
    allMessages {
      messageContent
      createdAt
      updatedAt
      id
      channel
    }
  }
`;

export const POST_MESSAGE = gql`
  mutation POST_MESSAGE($messageContent: String!, $channel: String!) {
    createMessage(messageContent: $messageContent, channel: $channel) {
      id
      messageContent
      channel
      createdAt
    }
  }
`;

export const DELETE_MESSAGE = gql`
  mutation DELETE_MESSAGE($messageId: ID) {
    deleteMessage(where: { id: $messageId }) {
      id
    }
  }
`;

export const SUBSCRIBE_MESSAGES = gql`
  subscription Message {
    Message(filter: { mutation_in: [CREATED] }) {
      mutation
      node {
        messageContent
        createdAt
        updatedAt
        id
        channel
      }
    }
  }
`;
