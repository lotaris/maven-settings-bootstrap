# maven-settings-bootstrap

> Create a `settings.xml` from a bootstrap file based on a configuration file to do some replacements for the file generated.

### The problem

> It is a nightmare to manage multiple projects with tons of configuration that depends of the environment where the project is deployed;

> we must ensure there is no `production` password or critical information present on the computer of developers;

> we want to keep flexibility to change some configuration on my machine without impacting my colleagues;

> `OS` management is also a nightmare when we must configure paths or anything related to the differences between each operating systems;

> adding a new property in a profile on the `settings.xml` means to ask developers to update manually their own `settings.xml` which is a nightmare and largely error prone.

### The solution

> A tool that helps to have a `template` or `bootstrap` `settings.xml` file where we apply a filtering processing to generate a new `settings.xml` file ready to use with the proper configuration; taking care of the specificities of the developer.

> This is this tool ! It aims to facilitate the `settings.xml` management for multiple projects and multiple environments by facilitate the generation of a new `settings` file everytime the `bootstrap` file has a change just by running one command: `msb`.

**[Installation](#installation) &mdash; [Documentation](#documentation) &mdash; [Contributing](#contributing) &mdash; [License](#license)**


<a name="installation"></a>
## Installation

To start to use `Maven Settings Bootstrap`, you should first install the module globally.

```
npm install -g maven-settings-bootstrap
```

*Note*: Depending your setup, you should be required to install the module with admin privileges.

Create a main configuration file in `~/.m2` called `msb.yml` with that content:

```yml
vars:
  varNameExample: varValueExample
  ...

properties:
  property.name.example: propertyValueExample
  ...
```

This file will be used to generate the `settings.xml`

Inside any folder (a project folder for example), be sure to have a file `msb-settings.xml` which will be your `settings.xml` template. You can have the following partial content for example:

```xml
...
<profile>
  <id>oneProfile</id>

  <properties>
    <var.name.example>{{ varNameExample }}</var.name.example>
  </properties>
</profile>
...
```

You can run the command:

```bash
$> msb
```

This will produce the `settings.xml` in the same folder with the following content:

```xml
<profile>
  <id>oneProfile</id>

  <properties>
    <var.name.example>varNameValue</var.name.example>
  </properties>
</profile>
```

<a name="documentation"></a>
## Documentation

This README is the main usage documentation.

`Maven Settings Bootstrap` uses external libraries to provide some of its functionality; refer to their documentation for more information:

* [Promises with the q library](https://github.com/kriskowal/q)
* [SWIG for templating](http://paularmstrong.github.io/swig)

The source code is also heavily commented and run through [Docker](https://github.com/jbt/docker), so you can read the resulting [**annotated source code**][annotated-source] for more details about the implementation.

Check the [CHANGELOG](CHANGELOG.md) for information about new features and breaking changes.

## Usage

<a name="toc"></a>

* [Examples](#examples)
  * [First example](#first-example)
  * [Second example](#second-example)
* [How to create a bootstrap file?](#how-to-create-bootstrap-file)
* [How to override the default paths?](#how-to-override-default-paths)

## Examples

Before going in the details, let's take a look to some examples.

<a name="first-example"></a>
### First example

To generate a `settings.xml`, you need to have a `bootstrap` settings file that acts as a template of your final `settings.xml` and a main configuration file that will be used to do the replacements for the generated file.

Our main configuration file for this first example (you can take a look to the [First example][first-example].) has the following content:

```yml
vars:
  mysql_username: "databaseUser"
  mysql_password: "databasePassword"
```

Then, our `bootstrap` file contains the following. You will notice that there are two variables that will be used as placeholders for the replacement process.

```xml
...
<profile>
  <id>profileOne</id>

  <properties>
    <profile.one.mysql.user>{{ mysql_username }}</profile.one.mysql.user>
    <profile.one.mysql.pass>{{ mysql_password }}</profile.one.mysql.pass>
    <profile.one.mysql.db>firstDatabaseName</profile.one.mysql.db>
  </properties>
</profile>

<profile>
  <id>profileTwo</id>

  <properties>
    <profile.two.mysql.user>{{ mysql_username }}</profile.two.mysql.user>
    <profile.two.mysql.pass>{{ mysql_password }}</profile.two.mysql.pass>
    <profile.two.mysql.db>secondDatabaseName</profile.two.mysql.db>
  </properties>
</profile>
...
```

And finally, we have this output once we generated the `settings.xml`

```xml
...
<profile>
  <id>profileOne</id>

  <properties>
    <profile.one.mysql.user>databaseUser</profile.one.mysql.user>
    <profile.one.mysql.pass>databasePassword</profile.one.mysql.pass>
    <profile.one.mysql.db>firstDatabaseName</profile.one.mysql.db>
  </properties>
</profile>

<profile>
  <id>profileTwo</id>

  <properties>
    <profile.two.mysql.user>databaseUser</profile.two.mysql.user>
    <profile.two.mysql.pass>databasePassword</profile.two.mysql.pass>
    <profile.two.mysql.db>secondDatabaseName</profile.two.mysql.db>
  </properties>
</profile>
...
```

You can notice that the variables are replaced by the real values stored inside the main configuration file.

To get that result, we simply run the command:

```bash
$> cd <folderWhereIsTheMsbSettings>
$> msb
```

Then you can see the [result][first-result].

<a name="second-example"></a>
### Second example

The second example is a little bit more complex because we use a second replacement technique present in the tool. In fact, we can override some properties inside the `settings.xml` during the replacement process.

Our main configuration file for this first example (you can take a look to the [Second example][second-example].) has the following content:

```yml
vars:
  mysql_username: "databaseUser"
  mysql_password: "databasePassword"

properties:
  profile.one.mysql.user: "moreSpecificDatabaseUser"
  profile.two.mysql.user: "moreSpecificDifferentDatabaseUser"
  profile.three.mysql.db: "weNeedToUseDifferentDbNameForSpecificTest"
```

Then, our `bootstrap` file contains the following. You will notice that there are two variables that will be used as placeholders for the replacement process.

```xml
...
<profile>
  <id>profileOne</id>

  <properties>
    <profile.one.mysql.user>{{ mysql_username }}</profile.one.mysql.user>
    <profile.one.mysql.pass>{{ mysql_password }}</profile.one.mysql.pass>
    <profile.one.mysql.db>firstDatabaseName</profile.one.mysql.db>
  </properties>
</profile>

<profile>
  <id>profileTwo</id>

  <properties>
    <profile.two.mysql.user>{{ mysql_username }}</profile.two.mysql.user>
    <profile.two.mysql.pass>{{ mysql_password }}</profile.two.mysql.pass>
    <profile.two.mysql.db>secondDatabaseName</profile.two.mysql.db>
  </properties>
</profile>

<profile>
  <id>profileThree</id>

  <properties>
    <profile.three.mysql.user>{{ mysql_username }}</profile.three.mysql.user>
    <profile.three.mysql.pass>{{ mysql_password }}</profile.three.mysql.pass>
    <profile.three.mysql.db>thirdDatabaseName</profile.three.mysql.db>
  </properties>
</profile>
...
```

And finally, we have this output once we generated the `settings.xml`

```xml
...
<profile>
  <id>profileOne</id>

  <properties>
    <profile.one.mysql.user>moreSpecificDatabaseUser</profile.one.mysql.user>
    <profile.one.mysql.pass>databasePassword</profile.one.mysql.pass>
    <profile.one.mysql.db>firstDatabaseName</profile.one.mysql.db>
  </properties>
</profile>

<profile>
  <id>profileTwo</id>

  <properties>
    <profile.two.mysql.user>moreSpecificDifferentDatabaseUser</profile.two.mysql.user>
    <profile.two.mysql.pass>databasePassword</profile.two.mysql.pass>
    <profile.two.mysql.db>secondDatabaseName</profile.two.mysql.db>
  </properties>
</profile>

<profile>
  <id>profileThree</id>

  <properties>
    <profile.three.mysql.user>databaseUser</profile.three.mysql.user>
    <profile.three.mysql.pass>databasePassword</profile.three.mysql.pass>
    <profile.three.mysql.db>weNeedToUseDifferentDbNameForSpecificTest</profile.three.mysql.db>
  </properties>
</profile>
...
```

You can notice that the variables are replaced by the real values stored inside the main configuration file. But also the property of the third profile that was not previously handled by variables replacement. And finally, also some more specific values were replaced in properties that were previously replaced by the variable replacement process.

To get that result, we simply run the command:

```bash
$> cd <folderWhereIsTheMsbSettings>
$> msb
```

Then you can see the [result][second-result].

<a name="how-to-create-bootstrap"></a>
## How to create a bootstrap file?

The creation of a `bootstrap` file is quite easy. Create a file named `msb-settings.xml` somewhere relevant for you. In general, this will be done inside the root folder of a `maven` project.

Then, place your `settings.xml` content that is relevant for your project. The content that you often previously put into the `~/.m2/settings.xml`.

And finally, start to replace the value you want to have placeholders by the `SWIG` syntax.

During the generation process the `bootstrap` file is given to  [Swig](http://paularmstrong.github.io/swig/) which is the template engine used in `maven-settings-bootstrap`. This template engine is based on [Jinja](http://jinja.pocoo.org/) template engine. Then the syntax is quite similar and the possiblities to use filters is present. It means that you can be able to write something like that in your `bootstrap` files:

```
{{ someVariable | upper }}
```

which will result to (if someVariable value is "John"):

```
JOHN
```

In fact, all the `vars` key/value pairs from the main configuration file (`msb.yml` placed in `~/.m2`) are given to `SWIG`. This means that you can have conditional statements and so on in your template file.

<a name="#how-to-override-default-paths"></a>
## How to override the default paths?

By default, the tool is look for three different paths:

* `config file`: Which is the main configuration (Default: `~/.m2/msb.yml`);
* `bootstrap file`: Which is the `settings` template file (Default: `msb-settings.xml` looking in the current working directory);
* `output file`: Which is the `settings` resulting file (Default: `settings.xml` looking in the current working directory).

All those paths can be configured through `env` variables as below:

```bash
$> MSB_CONFIG_FILE=some/great/path/to/custom.yml MSB_BOOTSTRAP_FILE=some/great/path/to/bootstrap/file/custom-bootstrap.xml MSB_OUTPUTFILE=some/great/path/to/output/file/custom-settings.xml msb
```

You can use only one of these options if you want.

## Contributing

* [Fork](https://help.github.com/articles/fork-a-repo)
* Create a topic branch - `git checkout -b feature`
* Push to your branch - `git push origin feature`
* Create a [pull request](http://help.github.com/pull-requests/) from your branch

Please add a changelog entry with your name for new features and bug fixes.

## License

API Copilot is licensed under the [MIT License](http://opensource.org/licenses/MIT).
See [LICENSE.txt](LICENSE.txt) for the full text.

[annotated-source]: http://lotaris.github.io/maven-settings-bootstrap/annotated/index.js.html
[first-example]: https://github.com/lotaris/maven-settings-bootstrap/tree/master/examples/sources/first-example
[first-result]: https://github.com/lotaris/maven-settings-bootstrap/tree/master/examples/results/first-example
[second-example]: https://github.com/lotaris/maven-settings-bootstrap/tree/master/examples/sources/second-example
[second-result]: https://github.com/lotaris/maven-settings-bootstrap/tree/master/examples/results/second-example
