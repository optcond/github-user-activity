import { App } from "./app";
import { GithubApiWithCache } from "./lib/githubApiWithCache";

const args = process.argv.slice(2);

/* 
  GithubApi for realtime request
  GithubApiWithCache for cache request
*/
const api = new GithubApiWithCache(
  "https://api.github.com",
  "./cache",
  60 * 1000
);
const app = new App(api);

const main = async () => {
  await app.process({ username: args[0] });
};

main();
