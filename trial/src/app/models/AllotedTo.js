import { Timestamp } from 'firebase/firestore';

export class AllotedTo {
  constructor(
    id,
    reportId,
    stationId,
    assignedAt = new Date(),
    assignedBy = null,
    status = 'pending',
    notes = null,
    updatedAt = null,
    updatedBy = null
  ) {
    this.id = id;
    this.reportId = reportId;
    this.stationId = stationId;
    this.assignedAt = assignedAt;
    this.assignedBy = assignedBy;
    this.status = status;
    this.notes = notes;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
  }

  static converter = {
    toFirestore: (allotment) => {
      return {
        reportId: allotment.reportId,
        stationId: allotment.stationId,
        assignedAt: allotment.assignedAt instanceof Date ? Timestamp.fromDate(allotment.assignedAt) : allotment.assignedAt,
        assignedBy: allotment.assignedBy,
        status: allotment.status,
        notes: allotment.notes,
        updatedAt: allotment.updatedAt instanceof Date ? (allotment.updatedAt ? Timestamp.fromDate(allotment.updatedAt) : null) : allotment.updatedAt,
        updatedBy: allotment.updatedBy
      };
    },
    fromFirestore: (snapshot, options) => {
      const data = snapshot.data(options);
      return new AllotedTo(
        snapshot.id,
        data.reportId,
        data.stationId,
        data.assignedAt?.toDate(),
        data.assignedBy,
        data.status,
        data.notes,
        data.updatedAt?.toDate(),
        data.updatedBy
      );
    }
  };
}
