# Development guide
Once cloned, update npm dependencies to install required tooling by entering:
```shell
npm update
```
## Build
To build, enter:
```shell
npm run build
```
The output will be under the folder ./lib/node with ./lib/node/index.js as the main entry point.
## Test
To run the tests, enter:
```shell
npm run test
```
## Package
To package for the web, enter:
```shell
npm run package
```
The output will be in the folder ./lib/web with ./lib/web/state.js as the file to include in the ```<script>``` tag.
## Document
To create the HTML documentation for the public API:
```shell
npm run document
```
