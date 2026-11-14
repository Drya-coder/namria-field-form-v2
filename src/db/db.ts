import Dexie, { type Table } from 'dexie';

export interface FieldObservation {
  id?: number;
  formTitle: string;
  cornerNo: string;
  mapCodeNo?: string;
  proposedClassification: string;
  sitio?: string;
  barangay: string;
  municipality: string;
  province: string;
  lcCornerNo?: string;
  lcMapNo?: string;
  lcArcProgNo?: string;
  lcStNo?: string;
  lcStProgNo?: string;
  lcIdNo?: string;
  observationDate: string;
  timeStarted?: string;
  timeEnded?: string;
  duration?: string;
  instrumentType?: string;
  brandModel?: string;
  method?: string;
  northing?: string;
  easting?: string;
  datum?: string;
  gnssAccuracy?: string;
  baseStationName?: string;
  antennaHeight?: string;
  gnssCivNo?: string;
  generalObservation?: string;
  existingTenure?: string;
  issuesAndConflicts?: string;
  treeSpeciesAd?: string;
  timberAd?: string;
  treeSpeciesForest?: string;
  timberForest?: string;
  topographySlope?: string;
  existingLandUse?: string;
  claimants?: string;
  denrRepresentatives: Array<{ name: string; office: string; designation: string; date: string }>;
  namriaSurveyTeam: Array<{ name: string; designation: string; date: string }>;
  createdAt?: Date;
  synced?: boolean;
}

export class NamriaDatabase extends Dexie {
  observations!: Table<FieldObservation>;

  constructor() {
    super('NamriaFieldDB');
    this.version(1).stores({
      observations: '++id, cornerNo, barangay, observationDate, createdAt'
    });
  }
}

export const db = new NamriaDatabase();