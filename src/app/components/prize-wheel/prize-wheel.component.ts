import { Component, Inject, OnDestroy, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PrizeConfig } from '../prize-config/prize-config.component';
import { PrizeConfigComponent } from '../prize-config/prize-config.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-prize-wheel',
  templateUrl: './prize-wheel.component.html',
  styleUrls: ['./prize-wheel.component.scss']
})
export class PrizeWheelComponent implements OnDestroy {
  @ViewChild(PrizeConfigComponent) prizeConfig!: PrizeConfigComponent;

  defaultPrizes: PrizeConfig[] = [
    { value: 5, percentage: 50, color: '#4ECDC4' },
    { value: 10, percentage: 50, color: '#FF6B6B' }
  ];

  currentPrizes: PrizeConfig[] = [...this.defaultPrizes];
  
  spinning = false;
  translateX = 0;
  selectedPrize: number | null = null;
  showPrize = false;
  animationDuration = 5000;
  private sectionWidth = 100;
  private sectionGap = 2; // Width of border-right between sections
  private get fullSectionWidth() { return this.sectionWidth + this.sectionGap; }
  canSpin = true;
  private validationSubscription?: Subscription;

  constructor(
    public dialogRef: MatDialogRef<PrizeWheelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngAfterViewInit() {
    // Subscribe to prize config validation state
    this.validationSubscription = this.prizeConfig.isValid$.subscribe(
      isValid => this.canSpin = isValid
    );
  }

  ngOnDestroy() {
    if (this.validationSubscription) {
      this.validationSubscription.unsubscribe();
    }
  }

  onPrizesUpdated(prizes: PrizeConfig[]): void {
    if (Array.isArray(prizes) && prizes.every(prize => 
      typeof prize === 'object' && 
      typeof prize.value === 'number' && 
      typeof prize.percentage === 'number' && 
      typeof prize.color === 'string'
    )) {
      this.currentPrizes = prizes;
    }
  }

  spin() {
    if (this.spinning || !this.canSpin) return;
    
    this.spinning = true;
    this.selectedPrize = null;
    this.showPrize = false;
    
    // Reset position to start
    this.translateX = 0;
    
    // Force a reflow to ensure the initial position is set
    requestAnimationFrame(() => {
      // Get total width of one complete set of prizes (including gaps)
      const setWidth = this.currentPrizes.length * this.fullSectionWidth;
      
      // Generate a random number between 0 and 1
      const random = Math.random();
      let cumulativePercentage = 0;
      let winningIndex = 0;

      // Find the winning prize based on percentages
      for (let i = 0; i < this.currentPrizes.length; i++) {
        cumulativePercentage += this.currentPrizes[i].percentage / 100;
        if (random <= cumulativePercentage) {
          winningIndex = i;
          break;
        }
      }
      
      // Random number of sets to spin (between 12 and 18 rotations)
      const numberOfSets = Math.floor(Math.random() * 6) + 12;
      
      // The picker is positioned around 165px from the start (middle of second section)
      const pickerOffset = 169;
      
      // Calculate a random offset that keeps the prize centered around the picker
      // We want to stay within the section bounds (102px) while keeping the prize visible
      const maxOffset = 99;
      const randomOffset = Math.floor(Math.random() * maxOffset);;
      
      // Calculate total scroll distance:
      // 1. Full rotations
      // 2. Position to winning index (accounting for picker offset)
      // 3. Random position adjustment
      const totalScroll = (numberOfSets * setWidth) + 
                         (winningIndex * this.fullSectionWidth) - 
                         pickerOffset + randomOffset;
      
      // Animation duration 6-8 seconds
      this.animationDuration = Math.floor(Math.random() * 2000) + 6000;

      // Start the animation in the next frame
      requestAnimationFrame(() => {
        // Set new position to trigger animation
        this.translateX = -totalScroll;

        // Set the final prize after animation completes
        setTimeout(() => {
          this.spinning = false;
          this.showPrize = true;
          this.selectedPrize = this.currentPrizes[winningIndex].value;
        }, this.animationDuration);
      });
    });
  }

  close() {
    this.dialogRef.close(this.selectedPrize);
  }
}
