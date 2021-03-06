Durandal Scaffolding Node CLI
===========

<a href="http://www.wtfpl.net/download/wtfpl-badge-2/" rel="attachment wp-att-50"><img alt="wtfpl-badge-2" src="http://www.wtfpl.net/wp-content/uploads/2012/12/wtfpl-badge-2.png" width="80" height="15"></a>

Durandal-scaffold is a Node.JS CLI tool to help you get started with the [Durandal SPA Framework](http://durandaljs.com/).
Besides scaffolding new Viewmodels, Views and Spec files it supports as well the setup of your frontend app structure.
It is used via a guided approach prompting for actions or via shortcuts (see below)

Features
-------------------

##### Create the ds.config.json file which is used for specifying the appropriate paths
```js
ds setup
```

##### Create default folder structure
Besides the creation of the basic folder structure the scaffolding will also
create a basic app main.js entry file, which is already wired up properly with
RequireJS configs.

```js
ds prepare
----------

| app
| ----> viewmodels
| ----> views
| ----> main.js
| test
| ----> specs
```

##### Install the Durandal SPA Framework and Twitter Bootstrap v3 via bower
```js
ds install
```

##### Create a VM + Spec file
```js
ds vm [vmname]
```

##### Create a VM + View + Spec file
```js
ds vmfull [vmname]
```

##### Create the default Karma configuration file
This will setup the Karma Runner config file and test-main runner, preset to Jasmine 2.0 and RequireJS,
including the path setup for the DurandalJS Framework and it's dependencies.

```js
ds karma-config
```

Additionally you'd need to install Karma and it's necessary dependencies. The
easiest method is to add following entries to your package.json file

```json
"devDependencies": {
  "karma": "~0.12.16",
  "karma-jasmine": "~0.2.0",
  "karma-phantomjs-launcher": "~0.1.4",
  "requirejs": "~2.1.14",
  "karma-requirejs": "~0.2.2"
}
```

This will setup Karma with Jasmine 2.0 as well as PhantomJS as the headless
browser for running the tests. Karma-requirejs finally helps working with the
RequireJS environment of the DurandalJS Framework.

To run Karma in continous testing mode (watching file changes while development)
simple run following command in the terminal from your apps base folder.

```Shell
karma start
```

For additional information on how to tweak the karma config or add additional features
like code coverage please visit the [Karma homepage](http://karma-runner.github.io/0.12/index.html)


##### Run guided mode
After you've run ds setup you can continue all the other commands via the guided
cli mode instead of remembering all the parameters.

```Shell
ds
----------

[?] Choose a command: (Use arrow keys)
> Create a VM/Spec
  Create a VM/View/Spec
  Prepare the project structure
  Install Durandal via Bower
  Create the default Karma configuration and test-main file
  Exit

```


Quick Example
-------------

1. Create the folder for your new application [demo]
2. cd demo
3. ds setup
4. ds prepare
5. ds install
6. have fun ...


More information
----------------

For more information about Durandal please consult
the Durandal online docs at:

http://durandaljs.com/docs.html
