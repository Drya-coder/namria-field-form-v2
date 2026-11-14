import Dexie, { type Table } from 'dexie';

export interface DENRRepresentative {
  name: string;
  office: string;
  designation: string;
  date: string;
}

export interface SurveyTeamMember {
  name: string;
  designation: string;
  date: string;
}

export interface FieldObservation {
  id?: number;
  formTitle: string;
  cornerNo: string;
  mapCodeNo: string;
  proposedClassification: 'Alienable & Disposable' | 'Forestland';
  sitio: string;
  barangay: string;
  municipality: string;
  province: string;
  
  // To be filled out upon approval of proposed LC Map
  lcCornerNo: string;
  lcMapNo: string;
  lcArcProgNo: string;
  lcStNo: string;
  lcStProgNo: string;
  lcIdNo: string;

  // Record of GNSS Coordinates
  observationDate: string;
  timeStarted: string;
  timeEnded: string;
  duration: string;
  instrumentType: 'Handheld Unit' | 'Survey Grade Unit';
  brandModel: string;
  method: string;
  easting: string;
  northing: string;
  datum: string;
  gnssAccuracy: string;
  baseStationName: string;
  antennaHeight: string;
  gnssCivNo: string;

  // Other Relevant Information
  generalObservation: string;
  existingTenure: string;
  issuesAndConflicts: string;

  // Characteristics
  treeSpeciesAd: string;
  timberAd: string; // 'with' | 'w/o'
  treeSpeciesForest: string;
  timberForest: string; // 'with' | 'w/o'
  topographySlope: string;
  existingLandUse: string;

  // Claimants & Personnel
  claimants: string;
  denrRepresentatives: DENRRepresentative[];
  namriaSurveyTeam: SurveyTeamMember[];

  createdAt: Date;
  synced: boolean;
}

export class FieldFormDatabase extends Dexie {
  observations!: Table<FieldObservation, number>;

  constructor() {
    super('NamriaFieldFormDB_LC02');
    this.version(1).stores({
      observations: '++id, cornerNo, province, observationDate, synced'
    });
  }
}

export const db = new FieldFormDatabase();