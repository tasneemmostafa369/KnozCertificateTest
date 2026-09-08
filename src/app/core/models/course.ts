export interface ExpiredCourse {
  endDate: string;
  studentName: string;
  studentOrParentPhone: string;
  subjectName: string;
  planName: string;
  primaryTeacherName: string;
  primaryTeacherPhone: string;
  monitorName: string;
  monitorPhone: string;
  daysSinceExpiration?: number;
  sspId?: number;
}

export interface ExpiredCoursesResponse {
  status: boolean;
  message: string;
  record: {
    items: ExpiredCourse[];
    totalCount: number;
  };
}
