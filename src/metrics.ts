import { LevelDB } from './leveldb'
import WriteStream from 'level-ws'

export class Metric {
    public code: string;
    public value: number;
  
    constructor(cd: string, v: number) {
      this.code = cd;
      this.value = v;
    }
}
  
export class MetricsHandler {
    private db: any;

    constructor(dbPath: string) {
        this.db = LevelDB.open(dbPath);
    }

    public save(key: string, metrics: Metric[], callback: (error: Error | null) => void) {
        const stream = WriteStream(this.db);
        stream.on('error', callback);
        stream.on('close', callback);
        metrics.forEach((m: Metric) => {
            stream.write({ key: `metric:${key}:${m.code}`, value: m.value })
        });
        stream.end()
    }

    static get(callback: (error: Error | null, result?: Metric[]) => void) {
        const result = [
            new Metric('metric1', 1),
            new Metric('metric2', 2),
            new Metric('metric3', 3)
        ];
        callback(null, result);
    }
}