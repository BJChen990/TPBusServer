#!/usr/bin/env node

// @flow
import util from './util';
import BlueBird from 'bluebird';

const defaultOption = {encoding: 'utf8'};

function processFile(fileName: string): Promise<void> {
    return new Promise((resolve, reject) => {
        util.readFile(`../data/src/${fileName}`, {encoding: 'utf8'})
            .then((dataText: string): {[key: string]: {}} => {
                return JSON.parse(dataText);
            })
            .then((data: {[key: string]: {}}) => {
                return JSON.stringify(data.BusInfo);
            })
            .then((resultText: string) => {
                return util.writeFile(`../data/${fileName.replace(/^Get/, '')}.json`, resultText);
            })
            .then(resolve)
            .catch((err: Error) => {
                reject(err);
            })
    });
}

// First, get all the file names.
util.readDir('../data/src', defaultOption)
    .then((files: string[]) => {
        return files.filter((fileName) => {
            return fileName.charAt(0) !== '.';
        })
    })
    .then((files: string[]) => {
        return BlueBird.map(files, (fileName: string) => {
            return processFile(fileName);
        });
    })
    .then(() => {
        console.log('Purification complete.');
        process.exit(0);
    })
    .catch((err: Error) => {
        console.error(err.stack);
        process.exit(0);
    });
