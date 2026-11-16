import { jsPDF } from 'jspdf';
import { type FieldObservation } from '@/db/db';

export async function exportObservationToPDF(obs: FieldObservation) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const margin = 10;
  const usableWidth = pageWidth - (margin * 2); // 190mm

  const drawRect = (x: number, y: number, w: number, h: number) => {
    doc.setDrawColor(0);
    doc.setLineWidth(0.4);
    doc.rect(x, y, w, h);
  };

  const drawLine = (x1: number, y1: number, x2: number, y2: number) => {
    doc.setDrawColor(0);
    doc.setLineWidth(0.4);
    doc.line(x1, y1, x2, y2);
  };

  const loadImage = (url: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = url;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL('image/png'));
        } else {
          reject(new Error('Failed to get canvas context'));
        }
      };
      img.onerror = (error) => reject(error);
    });
  };

  const renderSectionHeader = (title: string, height: number = 6.5, fontSize: number = 8.5) => {
    doc.setFillColor(220, 220, 220);
    doc.rect(margin, y, usableWidth, height, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(fontSize);
    doc.text(title, pageWidth / 2, y + (height / 2) + 1, { align: 'center' });
    y += height;
    drawLine(margin, y, pageWidth - margin, y);
  };

  // ================= PAGE 1: TABULAR GRID LAYOUT =================
  let y = margin;

  drawRect(margin, y, usableWidth, 277);

  // --- HEADER WITH NAMRIA LOGO ---
  const headerHeight = 22;
  drawRect(margin, y, 25, headerHeight);
  
  try {
    const logoDataUrl = await loadImage('/namria%20logo.png');
    doc.addImage(logoDataUrl, 'PNG', margin + 1.2, y + 2.2, 17.6, 17.6);
  } catch (err) {
    console.error("Hindi na-load ang logo:", err);
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text('FIELD OBSERVATION FOR LAND CLASSIFICATION', margin + 25 + (usableWidth - 25) / 2, y + 7, { align: 'center', charSpace: 0.6 });
  doc.text('OF UNCLASSIFIED PUBLIC FOREST', margin + 25 + (usableWidth - 25) / 2, y + 13, { align: 'center', charSpace: 0.6 });

  drawLine(margin + 25, y + 16, pageWidth - margin, y + 16);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text(obs.formTitle || 'NAMRIA-ENRM-Form18 Ver3 Rev00', margin + 27, y + 19.5);

  y += headerHeight;
  drawLine(margin, y, pageWidth - margin, y);

  // --- SECTION I: PRE-DETERMINED CORNER DESCRIPTION ---
  renderSectionHeader('PRE-DETERMINED CORNER DESCRIPTION', 6.5, 8.5);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text(`Corner No.:`, margin + 2, y + 4);
  doc.setFont('helvetica', 'normal');
  doc.text(`${obs.cornerNo || ''}`, margin + 22, y + 4);

  drawLine(margin + 120, y, margin + 120, y + 6);
  doc.setFont('helvetica', 'bold');
  doc.text(`Map Code/No.:`, margin + 122, y + 4);
  doc.setFont('helvetica', 'normal');
  doc.text(`${obs.mapCodeNo || ''}`, margin + 145, y + 4);
  y += 6;
  drawLine(margin, y, pageWidth - margin, y);

  const isA_D = obs.proposedClassification === 'Alienable & Disposable';
  const isForest = obs.proposedClassification === 'Forestland';
  doc.setFont('helvetica', 'bold');
  doc.text('Proposed Classification:', margin + 2, y + 4);
  
  drawRect(margin + 55, y + 1, 3, 3);
  if (isA_D) {
    doc.setFont('helvetica', 'bold');
    doc.text('X', margin + 56, y + 3.5);
  }
  doc.text('Alienable & Disposable', margin + 60, y + 4);

  drawRect(margin + 125, y + 1, 3, 3);
  if (isForest) {
    doc.setFont('helvetica', 'bold');
    doc.text('X', margin + 126, y + 3.5);
  }
  doc.text('Forestland', margin + 130, y + 4);
  y += 6;
  drawLine(margin, y, pageWidth - margin, y);

  // Location details
  doc.setFont('helvetica', 'bold');
  doc.text('Sitio/Purok:', margin + 2, y + 4);
  doc.setFont('helvetica', 'normal');
  doc.text(`${obs.sitio || ''}`, margin + 22, y + 4);

  drawLine(margin + 120, y, margin + 120, y + 6);
  doc.setFont('helvetica', 'bold');
  doc.text('Barangay:', margin + 122, y + 4);
  doc.setFont('helvetica', 'normal');
  doc.text(`${obs.barangay || ''}`, margin + 138, y + 4);
  y += 6;
  drawLine(margin, y, pageWidth - margin, y);

  doc.setFont('helvetica', 'bold');
  doc.text('Municipality:', margin + 2, y + 4);
  doc.setFont('helvetica', 'normal');
  doc.text(`${obs.municipality || ''}`, margin + 25, y + 4);

  drawLine(margin + 120, y, margin + 120, y + 6);
  doc.setFont('helvetica', 'bold');
  doc.text('Province:', margin + 122, y + 4);
  doc.setFont('helvetica', 'normal');
  doc.text(`${obs.province || ''}`, margin + 138, y + 4);
  y += 6;
  drawLine(margin, y, pageWidth - margin, y);

  // --- TO BE FILLED OUT UPON THE APPROVAL OF THE PROPOSED LC MAP ---
  renderSectionHeader('TO BE FILLED OUT UPON THE APPROVAL OF THE PROPOSED LC MAP', 6.5, 8);

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  const approvalText = `Corner No. ${(obs as any).approvalAdCornerNo || '___'}, Block No. ${(obs as any).approvalAdBlockNo || '___'}, A&D, Proj. No. ${(obs as any).approvalAdProjNo || '___'}, LC No. ${(obs as any).approvalAdLcNo || '___'}        Corner No. ${(obs as any).approvalFlCornerNo || '___'}, Block No. ${(obs as any).approvalFlBlockNo || '___'}, FL, Proj. No. ${(obs as any).approvalFlProjNo || '___'}, LC No. ${(obs as any).approvalFlLcNo || '___'}`;
  doc.text(approvalText, margin + 2, y + 4);
  y += 5.5;
  drawLine(margin, y, pageWidth - margin, y);

  // --- SECTION II: RECORD OF GNSS COORDINATES ---
  renderSectionHeader('RECORD OF GNSS COORDINATES', 6.5, 8.5);

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.text(`Observation Date:`, margin + 2, y + 3.8);
  doc.setFont('helvetica', 'normal');
  doc.text(`${obs.observationDate || ''}`, margin + 30, y + 3.8);

  drawLine(margin + 58, y, margin + 58, y + 5);
  doc.setFont('helvetica', 'bold');
  doc.text(`Time started:`, margin + 60, y + 3.8);
  doc.setFont('helvetica', 'normal');
  doc.text(`${obs.timeStarted || ''}`, margin + 82, y + 3.8);

  drawLine(margin + 118, y, margin + 118, y + 5);
  doc.setFont('helvetica', 'bold');
  doc.text(`Time ended:`, margin + 120, y + 3.8);
  doc.setFont('helvetica', 'normal');
  doc.text(`${obs.timeEnded || ''}`, margin + 140, y + 3.8);

  drawLine(margin + 158, y, margin + 158, y + 5);
  doc.setFont('helvetica', 'bold');
  doc.text(`Duration:`, margin + 160, y + 3.8);
  doc.setFont('helvetica', 'normal');
  doc.text(`${obs.duration || ''}`, margin + 176, y + 3.8);
  y += 5;
  drawLine(margin, y, pageWidth - margin, y);

  // Eksaktong X coordinates para sa mga kolum (Kaliwa: 60mm, Kanan: 135mm)
  const col1Width = 60;
  const col2Width = 75; 
  const line1X = margin + col1Width; // 70mm
  const line2X = line1X + col2Width; // 145mm

  // Sub-header ng Instrument table
  doc.setFillColor(235, 235, 235);
  doc.rect(margin, y, usableWidth, 5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('INSTRUMENT', margin + 18, y + 3.5);
  drawLine(line1X, y, line1X, y + 5);
  doc.text('HANDHELD UNIT', line1X + 22, y + 3.5);
  drawLine(line2X, y, line2X, y + 5);
  doc.text('SURVEY GRADE UNIT', line2X + 10, y + 3.5);
  y += 5;
  drawLine(margin, y, pageWidth - margin, y);

  const isSurveyGrade = obs.instrumentType === 'Survey Grade Unit';
  const brandModelHeight = 9;
  const normalRowHeight = 5;

  const instRows = [
    { label: 'Brand/Model of Instrument/', valAd: isSurveyGrade ? '' : (obs.brandModel || ''), valForest: isSurveyGrade ? (obs.brandModel || '') : '', height: brandModelHeight },
    { label: 'Method', valAd: isSurveyGrade ? '' : (obs.method || ''), valForest: isSurveyGrade ? (obs.method || '') : '', height: normalRowHeight },
    { label: 'Easting:', valAd: isSurveyGrade ? '' : (obs.easting || ''), valForest: isSurveyGrade ? (obs.easting || '') : '', height: normalRowHeight },
    { label: 'Northing:', valAd: isSurveyGrade ? '' : (obs.northing || ''), valForest: isSurveyGrade ? (obs.northing || '') : '', height: normalRowHeight },
  ];

  instRows.forEach(row => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text(row.label, margin + 2, y + (row.height / 2) + 1);
    drawLine(line1X, y, line1X, y + row.height); // Eksaktong pantay na linya
    doc.setFont('helvetica', 'normal');
    doc.text(row.valAd, line1X + 2, y + (row.height / 2) + 1, { maxWidth: col2Width - 4 });
    drawLine(line2X, y, line2X, y + row.height); // Eksaktong pantay na linya
    doc.text(row.valForest, line2X + 2, y + (row.height / 2) + 1, { maxWidth: usableWidth - col1Width - col2Width - 4 });
    y += row.height;
    drawLine(margin, y, pageWidth - margin, y);
  });

  // --- DATUM, ACCURACY, BASE STATION & ANTENNA HEIGHT BLOCK ---
  const row5Y = y;
  const blockHeight = 10;

  drawRect(margin, row5Y, usableWidth, blockHeight);
  drawLine(line1X, row5Y, line1X, row5Y + blockHeight); // Pantay na linya pababa
  drawLine(line2X, row5Y, line2X, row5Y + blockHeight); // Pantay na linya pababa

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text(`Datum:`, margin + 2, row5Y + 3.8);
  doc.setFont('helvetica', 'normal');
  doc.text(`${obs.datum || 'WGS 84'}`, margin + 18, row5Y + 3.8);

  doc.setFont('helvetica', 'bold');
  doc.text(`GNSS Unit No.:`, margin + 2, row5Y + 8.8);
  doc.setFont('helvetica', 'normal');
  doc.text(`${obs.gnssCivNo || ''}`, margin + 26, row5Y + 8.8);
  drawLine(margin + 24, row5Y + 9.2, line1X - 4, row5Y + 9.2);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text(`GNSS Handheld Unit Accuracy:`, line1X + 2, row5Y + 3.8);
  doc.setFont('helvetica', 'normal');
  doc.text(`${obs.gnssAccuracy || ''}`, line1X + 49, row5Y + 3.8);
  drawLine(line1X + 46, row5Y + 4.2, line1X + 60, row5Y + 4.2);
  doc.setFont('helvetica', 'bold');
  doc.text('m.', line1X + 62, row5Y + 3.8);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text(`Base Station Name:`, line2X + 2, row5Y + 3.8);
  doc.setFont('helvetica', 'normal');
  doc.text(`${obs.baseStationName || ''}`, line2X + 32, row5Y + 3.8);
  drawLine(line2X + 30, row5Y + 4.2, pageWidth - margin - 4, row5Y + 4.2);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.text(`Antenna Height:`, line2X + 2, row5Y + 8.8);
  doc.setFont('helvetica', 'normal');
  doc.text(`${obs.antennaHeight || ''}`, line2X + 28, row5Y + 8.8);
  drawLine(line2X + 26, row5Y + 9.2, pageWidth - margin - 4, row5Y + 9.2);

  y = row5Y + blockHeight;
  drawLine(margin, y, pageWidth - margin, y);

  // --- SECTION III: OTHER RELEVANT INFORMATION ---
  renderSectionHeader('OTHER RELEVANT INFORMATION', 6.5, 8.5);

  const infoBoxHeight = 26;
  drawRect(margin, y, usableWidth, infoBoxHeight);
  drawLine(margin + 105, y, margin + 105, y + infoBoxHeight);
  drawLine(margin + 105, y + 13, pageWidth - margin, y + 13);

  doc.setFont('helvetica', 'bold');
  doc.text('Description/General Observation of corner and', margin + 2, y + 3.8);
  doc.text('immediate surroundings:', margin + 2, y + 7.5);
  doc.setFont('helvetica', 'normal');
  doc.text(obs.generalObservation || 'N/A', margin + 4, y + 12, { maxWidth: 98, lineHeightFactor: 1.3 });

  doc.setFont('helvetica', 'bold');
  doc.text('Existing Tenurial Instruments:', margin + 107, y + 3.8);
  doc.setFont('helvetica', 'normal');
  doc.text(obs.existingTenure || 'N/A', margin + 107, y + 8, { maxWidth: 80 });

  doc.setFont('helvetica', 'bold');
  doc.text('Issues and Concerns:', margin + 107, y + 16.5);
  doc.setFont('helvetica', 'normal');
  doc.text(obs.issuesAndConflicts || 'N/A', margin + 107, y + 21, { maxWidth: 80 });

  y += infoBoxHeight;
  drawLine(margin, y, pageWidth - margin, y);

  // --- SECTION IV: CHARACTERISTICS ---
  doc.setFillColor(235, 235, 235);
  doc.rect(margin, y, usableWidth, 5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('CHARACTERISTICS', margin + 15, y + 3.5);
  drawLine(line1X, y, line1X, y + 5);
  doc.text('PROPOSED A&D LAND', line1X + 20, y + 3.5);
  drawLine(line2X, y, line2X, y + 5);
  doc.text('PROPOSED FORESTLAND', line2X + 8, y + 3.5);
  y += 5;
  drawLine(margin, y, pageWidth - margin, y);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('A. Land Cover Category / Vegetation', margin + 2, y + 3.8);
  y += 4.5;
  drawLine(margin, y, pageWidth - margin, y);

  doc.text('1. Tree Species Found', margin + 4, y + 3.8);
  drawLine(line1X, y, line1X, y + 5.5);
  doc.setFont('helvetica', 'normal');
  doc.text(obs.treeSpeciesAd || '', line1X + 2, y + 3.8);
  drawLine(line2X, y, line2X, y + 5.5);
  doc.text(obs.treeSpeciesForest || '', line2X + 2, y + 3.8);
  y += 5.5;
  drawLine(margin, y, pageWidth - margin, y);

  // 2. Stand of Timber
  doc.setFont('helvetica', 'bold');
  doc.text('2. Stand of Timber', margin + 4, y + 5.5);
  drawLine(line1X, y, line1X, y + 11);
  drawLine(line2X, y, line2X, y + 11);

  drawRect(line1X + 4, y + 1.5, 3, 3);
  if (obs.timberAd === 'with') {
    doc.setFont('helvetica', 'bold');
    doc.text('X', line1X + 5, y + 4);
  }
  doc.setFont('helvetica', 'normal');
  doc.text('with commercial Timber', line1X + 10, y + 4);

  drawRect(line1X + 4, y + 6.5, 3, 3);
  if (obs.timberAd === 'w/o') {
    doc.setFont('helvetica', 'bold');
    doc.text('X', line1X + 5, y + 9);
  }
  doc.setFont('helvetica', 'normal');
  doc.text('w/o commercial Timber', line1X + 10, y + 9);

  drawRect(line2X + 4, y + 1.5, 3, 3);
  if (obs.timberForest === 'with') {
    doc.setFont('helvetica', 'bold');
    doc.text('X', line2X + 5, y + 4);
  }
  doc.setFont('helvetica', 'normal');
  doc.text('with commercial Timber', line2X + 10, y + 4);

  drawRect(line2X + 4, y + 6.5, 3, 3);
  if (obs.timberForest === 'w/o') {
    doc.setFont('helvetica', 'bold');
    doc.text('X', line2X + 5, y + 9);
  }
  doc.setFont('helvetica', 'normal');
  doc.text('w/o commercial Timber', line2X + 10, y + 9);

  y += 11;
  drawLine(margin, y, pageWidth - margin, y);

  doc.setFont('helvetica', 'bold');
  doc.text('B. Topography/Slope', margin + 2, y + 3.8);
  drawLine(line1X, y, line1X, y + 5.5);
  doc.setFont('helvetica', 'normal');
  doc.text(obs.topographySlope || '', line1X + 2, y + 3.8);
  y += 5.5;
  drawLine(margin, y, pageWidth - margin, y);

  doc.setFont('helvetica', 'bold');
  doc.text('C. Existing Land-Use', margin + 2, y + 3.8);
  drawLine(line1X, y, line1X, y + 5.5);
  doc.setFont('helvetica', 'normal');
  doc.text(obs.existingLandUse || '', line1X + 2, y + 3.8);
  y += 5.5;
  drawLine(margin, y, pageWidth - margin, y);

  // --- SECTION V: NAME OF CLAIMANTS ---
  const claimantsHeight = 7.5;
  drawRect(margin, y, usableWidth, claimantsHeight);
  doc.setFont('helvetica', 'bold');
  doc.text('NAME OF CLAIMANTS:', margin + 2, y + 4.8);
  doc.setFont('helvetica', 'normal');
  doc.text(`${obs.claimants || 'N/A'}`, margin + 38, y + 4.8);
  y += claimantsHeight;
  drawLine(margin, y, pageWidth - margin, y);

  // --- REPRESENTATIVES TABLE ---
  doc.setFillColor(220, 220, 220);
  doc.rect(margin, y, usableWidth, 4.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('REPRESENTATIVE FROM DENR REGIONAL OFFICE/PENRO/CENRO/LGU/OTHER OFFICES', pageWidth / 2, y + 3.2, { align: 'center' });
  y += 4.5;
  drawLine(margin, y, pageWidth - margin, y);

  const repHeaders = ['Name', 'Office', 'Designation', 'Signature', 'Date (DD/MM/YYYY)'];
  const repWidths = [45, 38, 42, 30, 35]; // Sum = 190mm
  
  let rx = margin;
  const repHeaderHeight = 4.5;
  repHeaders.forEach((rh, i) => {
    doc.setFontSize(i === 4 ? 6.5 : 8);
    doc.text(rh, rx + 2, y + 3.2);
    if (i < 4) drawLine(rx + repWidths[i], y, rx + repWidths[i], y + repHeaderHeight);
    rx += repWidths[i];
  });
  y += repHeaderHeight;
  drawLine(margin, y, pageWidth - margin, y);

  const rawReps = obs.denrRepresentatives && obs.denrRepresentatives.length > 0 ? obs.denrRepresentatives : [];
  const reps = [
    rawReps[0] || { name: '', office: '', designation: '', date: '' },
    rawReps[1] || { name: '', office: '', designation: '', date: '' },
    rawReps[2] || { name: '', office: '', designation: '', date: '' },
  ];

  const rowHeight = 5.5;
  reps.forEach(rep => {
    const rowStartY = y;
    let currX = margin;
    repWidths.forEach((w, i) => {
      if (i < 4) {
        currX += w;
        drawLine(currX, rowStartY, currX, rowStartY + rowHeight);
      }
    });

    rx = margin;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(rep.name || '', rx + 2, y + 3.8);
    rx += repWidths[0];
    doc.text(rep.office || '', rx + 2, y + 3.8);
    rx += repWidths[1];
    doc.text(rep.designation || '', rx + 2, y + 3.8);
    rx += repWidths[2];
    doc.text('', rx + 2, y + 3.8);
    rx += repWidths[3];
    doc.text(rep.date || '', rx + 2, y + 3.8);
    
    y += rowHeight;
    drawLine(margin, y, pageWidth - margin, y);
  });

  // --- NAMRIA SURVEY TEAM TABLE ---
  doc.setFillColor(220, 220, 220);
  doc.rect(margin, y, usableWidth, 4.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('NAMRIA SURVEY TEAM', pageWidth / 2, y + 3.2, { align: 'center' });
  y += 4.5;
  drawLine(margin, y, pageWidth - margin, y);

  const teamHeaders = ['Name', 'Designation', 'Signature', 'Date (DD/MM/YYYY)'];
  const prepWidth = 25; 
  const teamWidths = [60, 45, 30, 30]; // Sum = 165mm + prepWidth(25) = 190mm
  
  let tx = margin + prepWidth;
  teamHeaders.forEach((th, i) => {
    doc.setFontSize(i === 3 ? 6.5 : 8);
    doc.text(th, tx + 2, y + 3.2);
    if (i < 3) drawLine(tx + teamWidths[i], y, tx + teamWidths[i], y + repHeaderHeight);
    tx += teamWidths[i];
  });
  drawLine(margin + prepWidth, y, margin + prepWidth, y + repHeaderHeight);

  y += repHeaderHeight;
  drawLine(margin, y, pageWidth - margin, y);

  const rawTeam = obs.namriaSurveyTeam && obs.namriaSurveyTeam.length > 0 ? obs.namriaSurveyTeam : [];
  const teamMembers = [
    rawTeam[0] || { name: '', designation: '', date: '' },
    rawTeam[1] || { name: '', designation: '', date: '' },
    rawTeam[2] || { name: '', designation: '', date: '' },
  ];

  const totalTeamHeight = teamMembers.length * rowHeight;
  
  drawRect(margin, y, prepWidth, totalTeamHeight);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('Prepared by:', margin + 2, y + (totalTeamHeight / 2) + 1);

  teamMembers.forEach(member => {
    const rowStartY = y;
    let currTx = margin + prepWidth;
    teamWidths.forEach((w, i) => {
      if (i < 3) {
        currTx += w;
        drawLine(currTx, rowStartY, currTx, rowStartY + rowHeight);
      }
    });

    tx = margin + prepWidth;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text(member.name || '', tx + 2, y + 3.8);
    tx += teamWidths[0];
    doc.text(member.designation || '', tx + 2, y + 3.8);
    tx += teamWidths[1];
    doc.text('', tx + 2, y + 3.8);
    tx += teamWidths[2];
    doc.text(member.date || '', tx + 2, y + 3.8);
    
    y += rowHeight;
    drawLine(margin + prepWidth, y, pageWidth - margin, y);
  });
  drawLine(margin, y, pageWidth - margin, y);


  // ================= PAGE 2: SKETCH MAP, MONUMENT, A&D, & FORESTLAND =================
  doc.addPage();
  let p2y = margin;

  drawRect(margin, p2y, usableWidth, 277);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('NAMRIA FIELD OBSERVATION FORM - PAGE 2: PHOTO DOCUMENTATION & SKETCH MAP', pageWidth / 2, p2y + 5, { align: 'center' });
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.text(`Corner No.: ${obs.cornerNo || 'N/A'} | Location: ${obs.barangay || ''}, ${obs.municipality || ''}, ${obs.province || ''}`, pageWidth / 2, p2y + 10, { align: 'center' });
  
  p2y += 14;
  drawLine(margin, p2y, pageWidth - margin, p2y);

  const halfWidth = usableWidth / 2;

  const renderBox = (title: string, dataUrl: string | undefined, x: number, y: number, w: number, h: number) => {
    drawRect(x, y, w, h);
    doc.setFillColor(235, 235, 235);
    doc.rect(x, y, w, 6, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.text(title, x + (w / 2), y + 4, { align: 'center' });

    if (dataUrl) {
      try {
        const format = dataUrl.includes('image/png') ? 'PNG' : 'JPEG';
        doc.addImage(dataUrl, format, x + 3, y + 8, w - 6, h - 10);
      } catch (err) {
        doc.setFont('helvetica', 'italic');
        doc.text('Error rendering image', x + (w / 2), y + (h / 2), { align: 'center' });
      }
    } else {
      doc.setFont('helvetica', 'italic');
      doc.text('[No Image Provided]', x + (w / 2), y + (h / 2), { align: 'center' });
    }
  };

  const topBoxHeight = 110;
  renderBox('SKETCH MAP', obs.sketchMapDataUrl, margin, p2y, halfWidth, topBoxHeight);
  renderBox('PICTURE OF CONCRETE MONUMENT', obs.monumentPhotoDataUrl, margin + halfWidth, p2y, halfWidth, topBoxHeight);

  p2y += topBoxHeight;
  drawLine(margin, p2y, pageWidth - margin, p2y);

  const fullBoxHeight = 72;
  renderBox('PICTURE FACING PROPOSED A&D LAND', obs.adLandPhotoDataUrl, margin, p2y, usableWidth, fullBoxHeight);

  p2y += fullBoxHeight;
  drawLine(margin, p2y, pageWidth - margin, p2y);

  renderBox('PICTURE FACING PROPOSED FORESTLAND', obs.forestlandPhotoDataUrl, margin, p2y, usableWidth, fullBoxHeight);

  doc.save(`NAMRIA_Observation_Corner_${obs.cornerNo || 'Form'}.pdf`);
}

export default exportObservationToPDF;