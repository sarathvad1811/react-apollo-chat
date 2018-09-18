import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import { ApolloClient } from "apollo-client";
import { ApolloProvider, Query, Mutation } from "react-apollo";
import { GET_MESSAGES, POST_MESSAGE, SUBSCRIBE_MESSAGES } from "./Queries";
import { Input, Dimmer, Loader } from "semantic-ui-react";
// import { SubscriptionClient } from "subscriptions-transport-ws";
import { HttpLink } from "apollo-link-http";
import { InMemoryCache } from "apollo-cache-inmemory";
import { split } from "apollo-client-preset";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";
import MessagesList from "./Components/MessagesList";

const GRAPHQL_ENDPOINT =
  "https://api.graph.cool/simple/v1/xxxxxxxx"; // link to be changed here(to your graph cool api link)

const SUBSCRIPTIONS_ENDPOINT =
  "wss://subscriptions.graph.cool/v1/xxxxxxxxxxx"; // link to be changed here

const wsLink = new WebSocketLink({
  uri: SUBSCRIPTIONS_ENDPOINT,
  options: {
    reconnect: true
  }
});

const httpLink = new HttpLink({ uri: GRAPHQL_ENDPOINT });

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === "OperationDefinition" && operation === "subscription";
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache()
});

// client.query({ query: testQuery }).then(res => console.log(res));

class App extends Component {
  constructor() {
    super();
    this.state = {
      result: ""
    };
  }

  postMessage = (postMessageFunction, e) => {
    if (e.keyCode === 13 && e.target.value.trim() !== "") {
      postMessageFunction({
        variables: {
          messageContent: e.target.value.trim(),
          channel: "#general"
        },
        refetchQueries: [{ query: GET_MESSAGES }] // adding temporarily to render again
      });
      e.target.value = "";
    }
  };

  render() {
    return (
      <ApolloProvider client={client}>
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo" />
            <h1 className="App-title">Chat Application</h1>
          </header>
          <div style={{ paddingTop: 20 }}>
            <Query query={GET_MESSAGES}>
              {({ data, loading, networkStatus, subscribeToMore }) => {
                if (loading)
                  return (
                    <Dimmer active>
                      <Loader>Loading</Loader>
                    </Dimmer>
                  );

                if (networkStatus !== 7) return "No internet connection";

                const more = () =>
                  subscribeToMore({
                    document: SUBSCRIBE_MESSAGES,
                    updateQuery: (prev, { subscriptionData }) => {
                      if (!subscriptionData.data) return prev;
                      const { mutation, node } = subscriptionData.data.Message;
                      if (mutation !== "CREATED") return prev;

                      // const {
                      //   messageContent,
                      //   channel
                      // } = subscriptionData.data.Message.node;
                      return {
                        ...prev,
                        allMessages: [...prev.allMessages, node]
                      };
                    }
                  });

                return <MessagesList data={data} subscribeToMore={more} />;
              }}
            </Query>
            <Mutation mutation={POST_MESSAGE}>
              {postMessage => (
                <div>
                  <Input
                    ref={input => (this.inputtext = input)}
                    label="#general"
                    placeholder="Post a message..."
                    onKeyUp={e => this.postMessage(postMessage, e)}
                  />
                </div>
              )}
            </Mutation>
          </div>
        </div>
      </ApolloProvider>
    );
  }
}

export default App;
