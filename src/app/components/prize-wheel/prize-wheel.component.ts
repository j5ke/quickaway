import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-prize-wheel',
  templateUrl: './prize-wheel.component.html',
  styleUrls: ['./prize-wheel.component.scss']
})
export class PrizeWheelComponent {
  // 20 sections with weighted distribution:
  // $5: 10 sections (50%)
  // $1: 4 sections (20%)
  // $20: 3 sections (15%)
  // $50: 2 sections (10%)
  // $100: 1 section (5%)
  prizes: { value: number, color: string }[] = [
    { value: 5, color: '#4ECDC4' },
    { value: 1, color: '#FF6B6B' },
    { value: 5, color: '#4ECDC4' },
    { value: 20, color: '#96CEB4' },
    { value: 5, color: '#4ECDC4' },
    { value: 1, color: '#FF6B6B' },
    { value: 5, color: '#4ECDC4' },
    { value: 50, color: '#FF8B94' },
    { value: 5, color: '#4ECDC4' },
    { value: 1, color: '#FF6B6B' },
    { value: 5, color: '#4ECDC4' },
    { value: 20, color: '#96CEB4' },
    { value: 5, color: '#4ECDC4' },
    { value: 1, color: '#FF6B6B' },
    { value: 5, color: '#4ECDC4' },
    { value: 50, color: '#FF8B94' },
    { value: 5, color: '#4ECDC4' },
    { value: 20, color: '#96CEB4' },
    { value: 5, color: '#4ECDC4' },
    { value: 100, color: '#9B5DE5' }
  ];

  spinning = false;
  translateX = 0;
  selectedPrize: number | null = null;
  showPrize = false;
  animationDuration = 5000;
  private sectionWidth = 100;
  private winningIndex: number | null = null;

  constructor(
    public dialogRef: MatDialogRef<PrizeWheelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // Start with the ribbon centered
    this.translateX = 0;
  }

  spin() {
    if (this.spinning) return;

    this.spinning = true;
    this.selectedPrize = null;
    this.showPrize = false;
    this.winningIndex = null;

    // Get total width of one complete set of prizes
    const setWidth = this.prizes.length * this.sectionWidth;
    
    // Calculate random section within the next complete set
    const randomSection = Math.floor(Math.random() * this.prizes.length);
    
    // Always spin at least 2 full sets plus the random section
    const minScroll = (2 * setWidth) + (randomSection * this.sectionWidth);
    
    // Animation duration 6-8 seconds
    this.animationDuration = Math.floor(Math.random() * 2000) + 6000;

    // Always spin from the starting position moving left
    this.translateX = -minScroll;

    setTimeout(() => {
      this.spinning = false;
      this.showPrize = true;
      this.winningIndex = randomSection;
      this.selectedPrize = this.prizes[randomSection].value;
    }, this.animationDuration);
  }

  close() {
    this.dialogRef.close(this.selectedPrize);
  }
}
