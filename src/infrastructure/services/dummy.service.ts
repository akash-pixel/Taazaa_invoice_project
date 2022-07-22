import { DummyRepository } from '../repositories/dummy.repository'

export interface IDummyService {
    do(model: any): any;
}


export class DummyService implements IDummyService {
    private repository: any;

    constructor() {
        this.repository = new DummyRepository()        
    }

    public do(model: any) {
        
    }

    public getAllInvoices(){
        return this.repository.getAllInvoices()
    }

}
