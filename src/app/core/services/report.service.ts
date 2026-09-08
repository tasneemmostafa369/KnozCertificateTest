import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ExpiredCoursesResponse } from '../models/course';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private http = inject(HttpClient);

  getExpiredCourses(pageNumber: number, pageSize: number, studentSearch: string = ''): Observable<ExpiredCoursesResponse> {
    let params = new HttpParams()
      .set('IsGracePeriodExceeded', 'false')
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    if (studentSearch) {
      params = params.set('StudentSearch', studentSearch);
    }

    return this.http.get<ExpiredCoursesResponse>('https://knoz-api.knoz.online/api/Report/Expired-Courses', { params });
  }
}
