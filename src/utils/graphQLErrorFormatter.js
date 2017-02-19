// @flow

import { GraphQLError } from "graphql";
import type { GraphQLFormattedError } from "graphql";
import ClientError from "./clientError";

type ErrorFormatter = (error: GraphQLError) =>
 GraphQLFormattedError
  & { stack?: string };

// Function that returns a formatter function that
// can be used to format GraphQLErrors in express-graphql
// to a json object that are displayed when making
// requests to a GraphQL API.
//
// This function can create two kinds of formatters depending
// on the value of the `debugMode` parameter.
//
// If `debugMode` is true then a formatter error is returned that
// is suitable for debugging; contains a stacktrace and outputs the
// message of the error,
//
// If `debugMode` is false then an error formatter is returned that is
// suitable for production. This error is built up as follows:
// - If GraphQLError.originalError is a ClientError, then we output
//   the message associated with this error. These are meant as
//   display errors that can be displayed to the user on the client
//   directly.
// - If GraphQLError.originalError is an Error, then we assume that is
//   an internal server error.
// - If GraphQLError has no originalError, then we assume that it is an error
//   with the query.
//
export default (debugMode: boolean = false): ErrorFormatter => {
  return (error: GraphQLError) => {
    let message: string;
    if (debugMode) {
      message = error.message;
    } else {
      if (error.originalError) {
        const { originalError } = error;
        if (originalError instanceof ClientError) {
          message = originalError.message;
        } else {
          message = "Internal Server Error";
        }
      } else {
        message = error.message;
      }
    }

    return {
      message,
      ...(error.locations ? { locations: error.locations } : null),
      ...(error.path ? { path: error.path } : null),
      ...(debugMode ? { stack: error.stack } : null)
    };
  };
}
