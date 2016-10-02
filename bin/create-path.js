// @flow
import util from './util';
import {Path} from '../models';
import BlueBird from 'bluebird';

type PathSource = {
    pathAttributeId: number,
    stopId: number,
    sequenceNo: number
}

util.readFile('data/pathDetail.json', {encoding: 'utf8'})
.then((data: string): Object[] => {
    return JSON.parse(data);
})
.then((paths: PathSource[]) => {
    return paths.map((path: PathSource) => {
        return {
            pathAttributeId: path.pathAttributeId,
            stopId: path.stopId,
            sequenceNumber: path.sequenceNo
        }
    })
})
.then((paths: Object[]) => {
    return util.sliceAndBulkCreate(paths, Path);
})
.then(() => {
    console.log('Path creation done.');
    process.exit(0);
})
.catch((err: Error) => {
    console.error(err.stack);
    process.exit(0);
});
