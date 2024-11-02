import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent {
  @HostListener('window:scroll', ['$event'])
  onScroll(event: Event): void {
    if (window.scrollY < 0) {
      window.scrollTo(0, 0); // Prevent negative scrolling (white space at the top)
    }
  }
}
