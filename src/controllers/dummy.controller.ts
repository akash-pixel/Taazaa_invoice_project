// import { inject, injectable } from "inversify";
import "reflect-metadata";

import { IDummyService, DummyService } from "../infrastructure/services/dummy.service";

// import TYPES from "../infrastructure/types";

// @injectable()
export class DummyController {
    private services: any;
    // static services: any;

    // constructor( private dummyService: IDummyService) {
    constructor( ) {    
    }

    // public async listDummies(req: any, res: any) {
    //     return this.dummyService.do(req.query);
    // }

    public init(){
        this.services = new DummyService()
    }

    public async getInvoices( req: any, res: any) {

        // if(!this.services){
        //     this.init()
        // }

        // return await this.services.getAllInvoices()
        return new DummyService().getAllInvoices()
    }
}
