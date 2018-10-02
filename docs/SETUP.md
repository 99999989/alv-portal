# Development Setup

## Prerequisites

* JDK 1.8 or later (only required when building with Maven)
* node.js 10.5.x
* npm 6.1.x

## Build & run with Maven

### Build

1. Execute `./mvnw clean install`.

To make IntelliJ IDEA use Maven Wrapper by default, install and enable the following plugin:
* https://plugins.jetbrains.com/plugin/10633-maven-wrapper-support

### Build without tests

* To skip unit tests, execute `./mvnw clean install -DskipTests`.
* To skip integration and UI E2E tests, execute `./mvnw clean install -DskipITs`.
* To skip all tests, execute `./mvnw clean install -DskipTests -DskipITs`.

### Build incl. app docker image

1. First authenticate locally against the internal docker repository as follows: `docker login alvch-dockerv2-local.jfrog.io`.
    * Once executed, the credentials will be stored permanently in your docker config file.
    * For credentials, ask project team members.
1. Build or/and push the image separately:
    1. Build the project as usually with: `./mvnw clean install` 
    1. To build the image, execute `./mvnw dockerfile:build`
    1. To push the image, execute `./mvnw dockerfile:push`
1. Alternatively you can build or/and push the image together with building the whole project:
    1. To build the project and image, execute: `./mvnw clean install -Pdocker`
    1. To build the project inl. building and pushing the image, execute: `./mvnw clean install -Pdocker -Ddocker-push`

Please note, that pushing docker images locally is usually not needed. It will be performed by the CICD toolchain automatically.

### Run app JAR

1. Execute `java -jar alv-portal-webapp/target/alv-portal-webapp-<project.version>.jar`.    
1. Verify that the application is running by visiting the following URL: _http://localhost:8080_.

### Run app docker image

1. Execute `docker run -p 8080:8080 alvch-dockerv2-local.jfrog.io/alvch/alv-portal-webapp:<project.version>`.   
1. Verify that the application is running by visiting the following URL: _http://localhost:8080_.

## Build & run with Angular CLI (for local development) 

Before executing any of the following commands:
1. Switch to the **alv-portal-ui** directory.
1. Install NPM dependencies by executing `npm install` command.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the _target/dist_ directory.
* If you don't have installed _ng_ client globally, replace _ng_ command with a full path as follows: `node_modules/.bin/ng build`

### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

### Run development server with Angular CLI

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.