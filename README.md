[![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)

## Prerequisite Technologies
### Linux
* *Node.js* - <a href="http://nodejs.org/download/">Download</a> and Install Node.js, nodeschool has free <a href=" http://nodeschool.io/#workshoppers">node tutorials</a> to get you started.

If you're using ubuntu this is the preffered repository to use...

```bash
$ curl -sL https://deb.nodesource.com/setup | sudo bash -
$ sudo apt-get update
$ sudo apt-get install nodejs
```

* *Git* - Get git using a package manager or <a href="http://git-scm.com/downloads">download</a> it.

### Windows
* *Node.js* - <a href="http://nodejs.org/download/">Download</a> and Install Node.js, nodeschool has free <a href=" http://nodeschool.io/#workshoppers">node tutorials</a> to get you started.
* *Git* - The easiest way to install git and then run the rest of the commands through the *git bash* application is by downloading and installing <a href="http://git-scm.com/download/win">Git for Windows</a>

### OSX
* *Node.js* -  <a href="http://nodejs.org/download/">Download</a> and Install Node.js or use the packages within brew or macports.
* *git* - Get git <a href="http://git-scm.com/download/mac">from here</a>.

## Prerequisite packages
* This currently works with grunt..

```
$ npm install -g grunt-cli
```

Alternatively, when not using `grunt` (and for production environments) you can run:
```bash
$ node ./bin/www
```
`NODE_CONFIG_DIR` is a directory that contains application configurations (default.json, development.json, production.json)

Then, open a browser and go to:
```bash
http://localhost:3000
```
#### Update NPM or Grunt
Sometimes you may find there is a weird error during install like npm's *Error: ENOENT*. Usually updating those tools to the latest version solves the issue.

* Updating NPM:
```bash
$ npm update -g npm
```

* Updating Grunt:
```bash
$ npm update -g grunt-cli
```

#### Cleaning NPM cache
NPM has a caching system for holding packages that you already installed.
We found that often cleaning the cache solves some troubles this system creates.

* NPM Clean Cache:
```bash
$ npm cache clean
```

---


Generate REST API documentation
--------
* Install `apidoc` from here [apiDoc](http://apidocjs.com/#install)

* Run ```bash
$ apidoc -i app/routes/ -o apidoc/
```

* open index.html inside `apidoc` directory.

---
