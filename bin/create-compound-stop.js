// @flow
import util from './util';
import {Stop, CompoundStop} from '../models';
import BlueBird from 'bluebird';

type StopGroup = {
    longitude: number,
    latitude: number,
    nameZh: string,
    address: string,
    stopIds: number[],
    routeIds: number[],
    goBack: number,
}

type MysqlStop = {
    nameZh: string,
    position: {
        type: string,
        coordinates: [number, number],
    },
    goBack: number,
    address: string,
    stopId: number,
    routeId: number,
}

type MysqlStopGroup = MysqlStop[];

type CompoundStopType = {
    nameZh: string,
    position: {
        type: string,
        coordinates: [number, number]
    },
    goBack: number,
    stopIds: string,
    routeIds: string
}

const LENGTH = 0.0003;

function groupByPositionPromise(stops: MysqlStopGroup): Promise<StopGroup[]> {
    return new Promise((resolve, reject) => {
        const stopLength = stops.length;
        const stopGroup: StopGroup[] = [];

        for (let i = 0; i < stopLength; i++) {
            let stopGroupLength = stopGroup.length;
            let notHit = true;
            let currentStop = stops[i];

            for (let j = 0; j < stopGroupLength; j++) {
                let currentStopGroup = stopGroup[j];

                if (shouldInGroup(currentStop, stopGroup[j])) {
                    addStopToGroup(currentStop, stopGroup[j]);
                    notHit = false;
                    break;
                }
            }
            if (notHit) {
                let coordinates = currentStop.position.coordinates;

                stopGroup.push({
                    longitude: coordinates[0],
                    latitude: coordinates[1],
                    nameZh: currentStop.nameZh,
                    address: currentStop.address,
                    stopIds: [currentStop.stopId],
                    routeIds: [currentStop.routeId],
                    goBack: currentStop.goBack
                })
            }
        }

        resolve(stopGroup);
    });
}

function addStopToGroup(stop, stopGroup: StopGroup): void {
    const oldLength = stopGroup.stopIds.length;
    const stopCoordinate = stop.position.coordinates;

    stopGroup.stopIds.push(stop.stopId);
    stopGroup.routeIds.push(stop.routeId);
    stopGroup.longitude = ((stopGroup.longitude * oldLength) + stopCoordinate[0]) / (oldLength + 1);
    stopGroup.latitude = ((stopGroup.latitude * oldLength) + stopCoordinate[1]) / (oldLength + 1);
}

function shouldInGroup(stop, stopGroup: StopGroup): boolean {
    const stopCoordinate = stop.position.coordinates;
    const stopLongitude = stopCoordinate[0];
    const stopLatitude = stopCoordinate[1];
    const groupLongitude = stopGroup.longitude;
    const groupLatitude = stopGroup.latitude;

    if (
        (stopLongitude > groupLongitude + LENGTH) ||
        (stopLongitude < groupLongitude - LENGTH) ||
        (stopLatitude > groupLatitude + LENGTH) ||
        (stopLatitude < groupLatitude - LENGTH)
    ) {
        return false;
    }

    return true
}

function groupByNameAndBack(stops: MysqlStop[]): MysqlStopGroup[] {
    const lookup: {[key: string]: MysqlStopGroup} = {};
    const stopLength = stops.length;

    for (let i = 0; i < stopLength; i++) {
        let currentStop = stops[i];
        let name = currentStop.nameZh;
        let goBack = currentStop.goBack;
        if (!lookup[name + goBack]) {
            lookup[name + goBack] = [currentStop];
        } else {
            lookup[name + goBack].push(currentStop);
        }
    }

    return Object.keys(lookup).map((key: string) => {
        return lookup[key];
    })
}

function groupByAddress(groupedStops: MysqlStopGroup[]): Array<MysqlStopGroup[]> {
    return groupedStops.map((stopGroup: MysqlStopGroup) => {
        let lookup: {[key: string]: MysqlStopGroup} = {};
        const stopLength = stopGroup.length;

        for (let i = 0; i < stopLength; i++) {
            let currentStop = stopGroup[i];
            let address = currentStop.address;

            if (!lookup[address]) {
                lookup[address] = [currentStop];
            } else {
                lookup[address].push(currentStop);
            }
        }

        return Object.keys(lookup).map((key: string) => {
            return lookup[key];
        })
    });
}

function flattenArray(anArray: [any[]]): any {
    return anArray.reduce((prev: any[], current: any[]) => {
        return prev.concat(current);
    }, []);
}

Stop.findAll({ attributes: ["nameZh", "position", "goBack", "address", "stopId", "routeId"] })
    .then(groupByNameAndBack)
    .then(groupByAddress)
    .then(flattenArray)
    .then((groupedStops: MysqlStopGroup[]) => {
        return BlueBird.map(groupedStops, (stops: MysqlStopGroup) => {
            return groupByPositionPromise(stops);
        });
    })
    .then(flattenArray)
    .then((result: StopGroup[]): CompoundStopType[] => {
        return result.map((group: StopGroup): CompoundStopType => {
            return {
                position: {
                    type: 'Point',
                    coordinates: [
                        group.longitude,
                        group.latitude
                    ]
                },
                nameZh: group.nameZh,
                address: group.address,
                stopIds: JSON.stringify(group.stopIds),
                routeIds: JSON.stringify(group.routeIds),
                goBack: group.goBack
            };
        });
    })
    .then((result: CompoundStopType[]) => {
        const length = Math.ceil(result.length * 0.01);
        const chunks = [];

        for (let i = 0; i < length; i++) {
            chunks.push(result.slice(i * 100, (i + 1) * 100));
        }
        return BlueBird.map(chunks, (chunk: Object) => {
            return CompoundStop.bulkCreate(chunk);
        })
    })
    .then(() => {
        console.log('done.');
        process.exit(0);
    })
    .catch((err: Error) => {
        console.error(err.stack);
        process.exit(1);
    });
