import {  Pool } from "pg";

/**
 * This file contains the code required
 * to initialize and configure Postgres DB
 */

export class DBConfig {
    private static dbConn: any;
    public static initPostgresDb(cb: (err: Error | null) => void): void {
        
        try {
            const pool = new Pool({
                connectionString: `postgres://user:password@localhost:5432/store`,
                connectionTimeoutMillis: 60000,
                min: 20,
                idleTimeoutMillis: 60000,
                keepAlive: true,
                log: (msg) => {console.log(msg)}
            });
            this.dbConn = pool
        } catch (error) {
            console.log(error)
        }
       
        cb(null);
    }

    public static getConnection(){
        // if(!this.dbConn){
        //     this.initPostgresDb(()=>{});
        // }
        return this.dbConn;
    }
}
