# ALV Portal

## Development Setup

See [Development Setup](docs/SETUP.md).

## Development Guidelines

See [Guidelines](docs/GUIDELINES.md).

## Update Guide

See [Update Guide](docs/UPDATE-GUIDE.md).

## Debugging Helpers

See [Debugging Helpers](docs/DEBUGGING-HELPERS.md).



1) in intellij console set export FONTAWESOME_NPM_AUTH_TOKEN="***"
das gleiche in .bash_profile oder .bashrc, Der Befehl echo $FONTAWESOME_NPM_AUTH_TOKEN sollte ab nun etwas ausgeben.
2) alle intellij neu starten
3) FONTAWESOME_NPM_AUTH_TOKEN=TOKEN npm install --save @fortawesome/fontawesome-pro in console ausführen. lange Warten!
5) in package.json: start:local starten
6) Einlogen ins portal mit admin admin
