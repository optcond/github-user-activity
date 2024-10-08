# github-user-activity

An implementation of the https://roadmap.sh/projects/github-user-activity

## Utility
* fetch latest events (last 30) for chosen user (username) from github
* currently supports formatting for 2 types of events: Create and Push
* has cache implemented by default

## Skills battle tested
* API wrapper
* Decorator pattern for caching responses by extending non-caching class
* Typeguards for response type processing

## Installation
```
yarn build
```
## Usage
```
yarn github-activity [username]
```
## Example
```
yarn gitgub-activity optcond
# response
Pushed 1 commits to https://api.github.com/repos/optcond/github-user-activity
Pushed 1 commits to https://api.github.com/repos/optcond/github-user-activity
Created branch in https://api.github.com/repos/optcond/github-user-activity
...
```
## Additional information
```
yarn test
```
unit & integration tests
