#!/usr/bin/env bash
set -e
npm install
npm run lint
npm run build
npx semantic-release --debug
