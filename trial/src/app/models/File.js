import { Timestamp } from 'firebase/firestore';

export class File {
  constructor(
    id,
    filename,
    type,
    size,
    url,
    path,
    uploadedAt = new Date(),
    uploadedBy = null
  ) {
    this.id = id;
    this.filename = filename;
    this.type = type;
    this.size = size;
    this.url = url;
    this.path = path;
    this.uploadedAt = uploadedAt;
    this.uploadedBy = uploadedBy;
  }

  static converter = {
    toFirestore: (file) => {
      return {
        filename: file.filename,
        type: file.type,
        size: file.size,
        url: file.url,
        path: file.path,
        uploadedAt: file.uploadedAt instanceof Date ? Timestamp.fromDate(file.uploadedAt) : file.uploadedAt,
        uploadedBy: file.uploadedBy
      };
    },
    fromFirestore: (snapshot, options) => {
      const data = snapshot.data(options);
      return new File(
        snapshot.id,
        data.filename,
        data.type,
        data.size,
        data.url,
        data.path,
        data.uploadedAt?.toDate(),
        data.uploadedBy
      );
    }
  };
}
