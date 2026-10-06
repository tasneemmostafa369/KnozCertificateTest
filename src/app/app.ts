import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxSpinnerComponent } from "ngx-spinner";
import { BrandingService } from './core/services/branding.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgxSpinnerComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private readonly brandingService = inject(BrandingService);
  protected readonly title = signal('knoz-academy');

  ngOnInit(): void {
    this.brandingService.init();
  }
}
