#!/usr/bin/env bash
set -e
npm install
npm t
npm run lint
npm run build
