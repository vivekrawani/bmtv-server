import express, { Express, Request, Response } from "express";
import { startStandaloneServer } from '@apollo/server/standalone';
import { expressMiddleware } from "@apollo/server/express4"
import bodyParser from "body-parser";
import cors from "cors";

import dotenv from "dotenv";
import { authors, books } from "./data"
import { ApolloServer } from "@apollo/server";
dotenv.config();

const port = process.env.PORT || 3000;

async function initServer(port: number) {
  const typeDefs = `
  type Author {
    name : String
    books : Int
    id : String
    }
  type Book {
    title: String
    authorId: String
    author : Author
    }
  type Query {
      books: [Book]
      authors : [Author]
      getAuthor(authorId : String) : Author
    }
      `

  const resolvers = {
    Book: {
      author: (book: any) => {
        console.log(book)
        const res = authors.find((author) => author.id == book.authorId);
        return res;
      }
    },
    Query: {
      books: () => books,
      authors: () => authors,
      getAuthor: (parent: unknown, { authorId }: any) => {
        console.log(authorId);
        // console.log(parent)
        const res = authors.find((author) => author.id == authorId);
        console.log(res)
        return res
      }
    },
  };
  const server = new ApolloServer({

    typeDefs,
    resolvers,
  });
  await server.start()

  const app: Express = express();
  app.use(cors())
  app.use(bodyParser.json())
  app.use("/graphql", expressMiddleware(server))

  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  })

}

initServer(Number(port));