import React from "react";
import { Mutation } from "react-apollo";
import { Divider, Label, Icon } from "semantic-ui-react";
import { DELETE_MESSAGE } from "../Queries";

export const MessageItem = ({ message, index }) => (
  <div>
    <p key={index}>
      {message.messageContent}{" "}
      <Label image>
        <img
          alt="malt"
          src="https://react.semantic-ui.com/images/avatar/small/zoe.jpg"
        />
        {message.channel}
      </Label>
      <Mutation mutation={DELETE_MESSAGE}>
        {deleteMessage => (
          <Icon
            fitted
            name="delete"
            onClick={() => {
              
              deleteMessage({
                variables: { messageId: message.id },
                refetchQueries: [{ query: GET_MESSAGES }]
              });
            }}
          />
        )}
      </Mutation>
    </p>
    <Divider />
  </div>
);
