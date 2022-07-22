import { Sequelize } from 'sequelize';


export class DBConfig {
  private static dbConn: any;
  
  public static async initDb(cb: (err: Error | null) => void) {
      
      try {
        const sequelize = new Sequelize('postgres://user:password@localhost:5432/store') ;
        await sequelize.authenticate() ;
      } catch (error) {
          console.log(error)
      }
     
      cb(null);
  }

  public static getConnection(){
      return this.dbConn;
  }
}
