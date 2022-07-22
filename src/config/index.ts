/**
 * This file contains the code required
 * to expose config used by application.
 */
import { config as dotenvConfig } from "dotenv";
import * as path from "path";
import { IProcessConfig } from "../interfaces";

/**
 * Import Config from nemt.config
 */
const CONFIG_DIR = path.join(__dirname, "../../../nemt.config");

/**
 * Config imported from .env file
 */
  dotenvConfig();
  const CONFIG = { 
    connection: process.env.connection,
    reports: {
      HTTP_PORT:5000
    }
  }
export const processConfig: IProcessConfig = {
    dbConnectionString: process.env.dbConnectionString || ""
};

/**
 * Aggregate of all the configs
 */
export default {
    ...CONFIG,
    ...processConfig,
};
