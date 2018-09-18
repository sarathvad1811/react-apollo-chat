import React from "react";
import { MessageItem } from "./MessageItem";

export default class MeesagesList extends React.PureComponent {
  componentDidMount() {
    this.props.subscribeToMore();
  }

  render() {
    const { data } = this.props;
    return (
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {data.allMessages.map(message => (
          <MessageItem key={message.id} message={message} />
        ))}
      </ul>
    );
  }
}
