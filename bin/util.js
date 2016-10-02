// @flow
import fs from 'fs';
import BlueBird from 'bluebird';

export default {
    readFile(filePath: string, options: Object = {}): Promise<string> {
        return new Promise((resolve, reject) => {
            fs.readFile(filePath, options, (err: Error, data: string) => {
                if (err) {
                    return reject(err);
                }

                resolve(data);
            })
        })
    },

    writeFile(filePath: string, data: string, options: Object = {}): Promise<void> {
        return new Promise((resolve, reject) => {
            fs.writeFile(filePath, data, options, (err) => {
                if (err) {
                    return reject(err);
                }

                resolve();
            });
        })
    },

    readDir(filePath: string, options: Object = {}): Promise<string[]> {
        return new Promise((resolve, reject) => {
            fs.readdir(filePath, options, (err: Error, data: string[]) => {
                if (err) {
                    return reject(err);
                }

                resolve(data);
            })
        })
    },

    sliceAndBulkCreate(source: Object[], model: Object) {
        const length = Math.ceil(source.length * 0.01);
        const chunks = [];

        for (let i = 0; i < length; i++) {
            chunks.push(source.slice(i * 100, (i + 1) * 100));
        }
        return BlueBird.map(chunks, (chunk: Object) => {
            return model.bulkCreate(chunk);
        })
    }
}
