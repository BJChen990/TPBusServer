// @flow
import fs from 'fs';

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
    }
}
