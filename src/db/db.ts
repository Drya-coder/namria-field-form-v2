import Dexie, { type Table } from 'dexie';

export interface FieldObservation {
  id?: number;
  formTitle?: string;
  cornerNo?: string;
  mapCodeNo?: string;
  proposedClassification?: string;
  sitio?: string;
  barangay?: string;
  municipality?: string;
  province?: string;
  lcCornerNo?: string;
  lcMapNo?: string;
  lcArcProgNo?: string;
  lcStNo?: string;
  lcStProgNo?: string;
  lcIdNo?: string;
  observationDate?: string;
  timeStarted?: string;
  timeEnded?: string;
  duration?: string;
  instrumentType?: string;
  brandModel?: string;
  method?: string;
  easting?: string;
  northing?: string;
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
  denrRepresentatives?: Array<{ name?: string; office?: string; designation?: string; date?: string }>;
  namriaSurveyTeam?: Array<{ name?: string; designation?: string; date?: string }>;
  sketchMapDataUrl?: string;
  monumentPhotoDataUrl?: string;
  adLandPhotoDataUrl?: string;
  forestlandPhotoDataUrl?: string;
  createdAt?: Date;
  synced?: boolean;
}

export class FieldObservationDB extends Dexie {
  observations!: Table<FieldObservation, number>;

  constructor() {
    super('NamriaFieldObservationDB');
    this.version(1).stores({
      observations: '++id, cornerNo, barangay, municipality, province, observationDate, createdAt'
    });
  }
}

export const db = new FieldObservationDB();