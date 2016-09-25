declare class Bluebird {
    static map<T>(promiseList: T[], callback: (item: T) => Promise<any>)): Promise<any[]>;
}
