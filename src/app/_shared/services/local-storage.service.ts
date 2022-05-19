import { Injectable } from '@angular/core';
import { MagicStrings } from '../models/magic-strings.model';
import { ObservationDtoContainer } from '../models/observation.model';
import * as uuid from 'uuid';
import Dexie from '@dpogue/dexie';

interface IData {
  uid?: string,
  data: string,
  dbId?: number
}

class PawwDB extends Dexie {
  // Declare implicit table properties
  paww: Dexie.Table<IData, number>; // number = type of the primkey
  // ...other tables goes here...

  constructor () {
    super(MagicStrings.LocalStorageObsKey);
    this.version(1).stores({
        paww: '++dbId, uid, data',
    });
    // The following line is needed if your typescript
    // is compiled using babel instead of tsc:
    this.paww = this.table('paww');
  }
}

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  db!: PawwDB;

  constructor() {
    this.db = new PawwDB();
    this.db.open();
  }

  async getObservations(): Promise<ObservationDtoContainer[]> {
    const data = await this.db.paww.toArray() || [];
    return data.map((e, idx) => {
      const parsedData = JSON.parse(e.data)
      return { ...parsedData, dbId: e.dbId };
    });
  }

  async setObservation(data: ObservationDtoContainer) {
    const uid = uuid.v4();
    const stringifiedData = JSON.stringify({ uid, ...data });
    await this.db.paww.add({uid: uid, data: stringifiedData });
  }

  async removeObservation(id: number | undefined) {
    if (id) {
      const delResp = await this.db.paww.delete(id);
    }
  }

  async hasObservations(): Promise<boolean> {
    const foundData = await this.getObservations();
    if (foundData?.length > 0)
      return true;
    else
      return false;
  }

}
