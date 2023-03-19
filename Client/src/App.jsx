import { useState } from "react";
import "./App.css";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import DisplayData from "./DisplayData";

function App() {
  const client = new ApolloClient({
    cache: new InMemoryCache(),
    uri: "http://localhost:4000/graphql",
  });
  return (
    <>
      <ApolloProvider client={client}>
        <DisplayData />
      </ApolloProvider>
    </>
  );
}

export default App;
