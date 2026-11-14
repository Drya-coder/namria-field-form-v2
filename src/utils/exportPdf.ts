import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { type FieldObservation } from '@/db/db';

export const exportObservationToPDF = (obs: FieldObservation) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Header
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('REPUBLIC OF THE PHILIPPINES', 105, 14, { align: 'center' });
  doc.setFontSize(9);
  doc.text('DEPARTMENT OF ENVIRONMENT AND NATURAL RESOURCES', 105, 19, { align: 'center' });
  doc.text('NATIONAL MAPPING AND RESOURCE INFORMATION AUTHORITY (NAMRIA)', 105, 24, { align: 'center' });

  doc.setFontSize(11);
  doc.text('FIELD OBSERVATION FOR LAND CLASSIFICATION OF UNCLASSIFIED PUBLIC FOREST', 105, 32, { align: 'center' });
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(obs.formTitle || 'NAMRIA-ENRM-Forms18 Vers00', 105, 36, { align: 'center' });

  // Section I: Pre-Determined Corner Description
  autoTable(doc, {
    startY: 41,
    theme: 'grid',
    styles: { fontSize: 8, cellPadding: 2, lineColor: [0, 0, 0], lineWidth: 0.2 },
    headStyles: { fillColor: [220, 220, 220], textColor: [0, 0, 0], fontStyle: 'bold' },
    head: [[{ content: 'I. PRE-DETERMINED CORNER DESCRIPTION', colSpan: 4 }]],
    body: [
      [
        `Corner No.: ${obs.cornerNo || ''}`,
        { content: `Map Code/No.: ${obs.mapCodeNo || ''}`, colSpan: 2 },
        `Proposed Class: ${obs.proposedClassification || ''}`,
      ],
      [
        `Sitio/Purok: ${obs.sitio || ''}`,
        `Barangay: ${obs.barangay || ''}`,
        `Municipality: ${obs.municipality || ''}`,
        `Province: ${obs.province || ''}`,
      ],
      [
        {
          content: 'TO BE FILLED OUT UPON THE APPROVAL OF THE PROPOSED LC MAP',
          colSpan: 4,
          styles: { fontStyle: 'bold', fillColor: [245, 245, 245], fontSize: 7 },
        },
      ],
      [
        `Corner No.: ${obs.lcCornerNo || ''}\nSt. No.: ${obs.lcStNo || ''}`,
        `Map No.: ${obs.lcMapNo || ''}\nSt. Prog. No.: ${obs.lcStProgNo || ''}`,
        { content: `ARC Prog. No.: ${obs.lcArcProgNo || ''}\nId. No.: ${obs.lcIdNo || ''}`, colSpan: 2 },
      ],
    ],
  });

  // Section II: Record of GNSS Coordinates & Instruments
  autoTable(doc, {
    startY: (doc as any).lastAutoTable.finalY + 3,
    theme: 'grid',
    styles: { fontSize: 8, cellPadding: 2, lineColor: [0, 0, 0], lineWidth: 0.2 },
    headStyles: { fillColor: [220, 220, 220], textColor: [0, 0, 0], fontStyle: 'bold' },
    head: [[{ content: 'II. RECORD OF GNSS COORDINATES & INSTRUMENTS', colSpan: 4 }]],
    body: [
      [
        `Date: ${obs.observationDate || ''}`,
        `Time Started: ${obs.timeStarted || ''}`,
        `Time Ended: ${obs.timeEnded || ''}`,
        `Duration: ${obs.duration || ''}`,
      ],
      [
        `Instrument: ${obs.instrumentType || ''}`,
        { content: `Brand/Model: ${obs.brandModel || ''}`, colSpan: 2 },
        `Method: ${obs.method || ''}`,
      ],
      [
        `Northing: ${obs.northing || ''}`,
        `Easting: ${obs.easting || ''}`,
        `Datum: ${obs.datum || 'WGS 84'}`,
        `Accuracy: ${obs.gnssAccuracy || ''}`,
      ],
      [
        `Base Station: ${obs.baseStationName || ''}`,
        { content: `Antenna Height: ${obs.antennaHeight || ''}`, colSpan: 2 },
        `GNSS Civ No.: ${obs.gnssCivNo || ''}`,
      ],
    ],
  });

  // Section III: Other Relevant Information
  autoTable(doc, {
    startY: (doc as any).lastAutoTable.finalY + 3,
    theme: 'grid',
    styles: { fontSize: 8, cellPadding: 2, lineColor: [0, 0, 0], lineWidth: 0.2 },
    headStyles: { fillColor: [220, 220, 220], textColor: [0, 0, 0], fontStyle: 'bold' },
    head: [[{ content: 'III. OTHER RELEVANT INFORMATION', colSpan: 2 }]],
    body: [
      [{ content: `General Observation:\n${obs.generalObservation || 'N/A'}`, colSpan: 2 }],
      [
        `Existing Tenure/Instruments: ${obs.existingTenure || 'N/A'}`,
        `Issues and Conflicts: ${obs.issuesAndConflicts || 'N/A'}`,
      ],
    ],
  });

  // Section IV: Characteristics
  autoTable(doc, {
    startY: (doc as any).lastAutoTable.finalY + 3,
    theme: 'grid',
    styles: { fontSize: 8, cellPadding: 2, lineColor: [0, 0, 0], lineWidth: 0.2 },
    headStyles: { fillColor: [220, 220, 220], textColor: [0, 0, 0], fontStyle: 'bold' },
    head: [[{ content: 'IV. CHARACTERISTICS', colSpan: 2 }]],
    body: [
      [
        { content: 'PROPOSED A & D LAND', styles: { fontStyle: 'bold' } },
        { content: 'PROPOSED FORESTLAND', styles: { fontStyle: 'bold' } },
      ],
      [
        `1. Tree Species: ${obs.treeSpeciesAd || 'N/A'}\n2. Stand of Timber: ${obs.timberAd || 'w/o'}`,
        `1. Tree Species: ${obs.treeSpeciesForest || 'N/A'}\n2. Stand of Timber: ${obs.timberForest || 'w/o'}`,
      ],
      [
        `B. Topography / Slope: ${obs.topographySlope || 'N/A'}`,
        `C. Existing Land-Use: ${obs.existingLandUse || 'N/A'}`,
      ],
    ],
  });

  // Section V: Claimants & Personnel Signatures
  const denrRows = (obs.denrRepresentatives || []).map((rep) => [
    rep.name || '',
    rep.office || '',
    rep.designation || '',
    rep.date || '',
  ]);

  const teamRows = (obs.namriaSurveyTeam || []).map((member) => [
    member.name || '',
    'NAMRIA',
    member.designation || '',
    member.date || '',
  ]);

  autoTable(doc, {
    startY: (doc as any).lastAutoTable.finalY + 3,
    theme: 'grid',
    styles: { fontSize: 8, cellPadding: 2, lineColor: [0, 0, 0], lineWidth: 0.2 },
    headStyles: { fillColor: [220, 220, 220], textColor: [0, 0, 0], fontStyle: 'bold' },
    head: [[{ content: 'V. CLAIMANTS & PERSONNEL SIGNATURES', colSpan: 4 }]],
    body: [
      [{ content: `NAME OF CLAIMANTS: ${obs.claimants || 'None'}`, colSpan: 4, styles: { fontStyle: 'bold' } }],
      [
        { content: 'Name & Signature', styles: { fontStyle: 'bold', fillColor: [240, 240, 240] } },
        { content: 'Office / Agency', styles: { fontStyle: 'bold', fillColor: [240, 240, 240] } },
        { content: 'Designation', styles: { fontStyle: 'bold', fillColor: [240, 240, 240] } },
        { content: 'Date', styles: { fontStyle: 'bold', fillColor: [240, 240, 240] } },
      ],
      ...denrRows,
      ...teamRows,
    ],
  });

  // Save PDF File
  const safeCorner = (obs.cornerNo || 'Record').replace(/[^a-zA-Z0-9-_]/g, '_');
  const fileName = `NAMRIA_LC02_${safeCorner}_${obs.observationDate || 'Draft'}.pdf`;
  doc.save(fileName);
};