import {ApolloServer} from "apollo-server-express"
import { ApolloServerPluginDrainHttpServer, Context } from 'apollo-server-core';
import express from "express";
import jwt from "express-jwt";
import "reflect-metadata";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from 'body-parser';
import http from "http"
import { getSchema } from "./schema";
import geoip from "geoip-lite"
import dotenv from "dotenv";
import MobileDetect from "mobile-detect";



dotenv.config();

const graphQlPath=process.env.GRAPHQL_PATH;
const port=process.env.PORT;
const dbUrl=process.env.MONGODB_URL;

const auth = jwt({
  secret:process.env.JWT_SECRET,
  algorithms:['HS256'],
  credentialsRequired: false,
  getToken: function fromHeaderOrQuerystring(req) {
    if (req.headers.authorization &&
      req.headers.authorization.split(' ')[0] === 'Bearer' ) {
      return req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token) {
      return req.query.token;
    }
    return null;
  }
})


mongoose.connect(dbUrl, {
    autoIndex: true,
  }).then(() => {
    console.log("connected to mongodb")
  }).catch((e) => {
    console.log(e);
  })

  async function startApolloServer() {

    const app = express();
    const httpServer = http.createServer(app);
  
    app.use(
      graphQlPath,
      cors({
        origin: '*'
      }),
      bodyParser.json(),
      auth,
    )
  
    const schema=await getSchema();

    const server = new ApolloServer({
      schema,
      plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
      introspection: true,
      context:({req}) =>{
        const ip=req.headers['x-forwarded-for']||req.socket.remoteAddress
        const context: Context={
          req,
          user:req.user,
          ip,
          location:geoip.lookup(ip),
          md:new MobileDetect(req.headers['user-agent']),
        }
        return context;
      },
    });
    await server.start();
  
    server.applyMiddleware({ app, path: graphQlPath });
    await new Promise(resolve => httpServer.listen({ port }));
    
    console.log(`Server started at http://localhost:${port}/${graphQlPath}`)
    return { server, app}
  
  }
  
  startApolloServer()