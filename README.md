Durandal Scaffolding Node CLI
===========

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
```js
ds prepare
----------

| app
| ----> viewmodels
| ----> views
| test
| ----> specs
```

##### Install the Durandal SPA Framework via bower
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

##### Run guided mode
```js
ds
----------

[?] Choose a command: (Use arrow keys)
> Create a VM/Spec
  Create a VM/View/Spec
  Prepare the project structure
  Install Durandal via Bower
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
