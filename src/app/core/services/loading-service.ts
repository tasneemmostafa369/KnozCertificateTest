import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  constructor(
    private readonly ngxSpinnerService: NgxSpinnerService
  ) {}

  show(): void {
    this.ngxSpinnerService.show();
  }

  hide(): void {
    this.ngxSpinnerService.hide();
  }
}
