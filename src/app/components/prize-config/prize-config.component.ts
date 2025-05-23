import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

export interface PrizeConfig {
  value: number;
  percentage: number;
  color: string;
}

@Component({
  selector: 'app-prize-config',
  templateUrl: './prize-config.component.html',
  styleUrls: ['./prize-config.component.scss']
})
export class PrizeConfigComponent implements OnInit {
  @Input() initialPrizes: PrizeConfig[] = [];
  @Output() prizesUpdated = new EventEmitter<PrizeConfig[]>();

  prizeForm: FormGroup;
  colors = ['#4ECDC4', '#FF6B6B', '#96CEB4', '#FF8B94', '#9B5DE5'];
  errorMessage: string | null = null;
  isValid$ = new BehaviorSubject<boolean>(true);

  constructor(private fb: FormBuilder) {
    this.prizeForm = this.fb.group({
      prizes: this.fb.array([])
    });
  }

  ngOnInit() {
    // Initialize with at least 2 prizes if none provided
    if (this.initialPrizes.length === 0) {
      this.initialPrizes = [
        { value: 5, percentage: 50, color: this.colors[0] },
        { value: 10, percentage: 50, color: this.colors[1] }
      ];
    }
    
    // Create form controls for each prize
    this.initialPrizes.forEach(prize => this.addPrize(prize));
    
    // Subscribe to value changes to validate and emit updates
    this.prizeForm.valueChanges.subscribe(() => {
      const isValid = this.validatePercentages();
      this.isValid$.next(isValid);
      if (isValid) {
        const currentPrizes = this.prizeForm.get('prizes')?.value;
        if (currentPrizes) {
          this.prizesUpdated.emit(currentPrizes);
        }
      }
    });
  }

  get prizes() {
    return this.prizeForm.get('prizes') as FormArray;
  }

  addPrize(prize?: PrizeConfig) {
    const newPrize = this.fb.group({
      value: [prize?.value || 5, [Validators.required, Validators.min(0)]],
      percentage: [prize?.percentage || 0, [Validators.required, Validators.min(0), Validators.max(100)]],
      color: [prize?.color || this.colors[this.prizes.length % this.colors.length]]
    });

    this.prizes.push(newPrize);
    this.equalizePercentages();
  }

  removePrize(index: number) {
    if (this.prizes.length > 2) {
      this.prizes.removeAt(index);
      this.equalizePercentages();
    }
  }

  equalizePercentages() {
    const equalPercentage = 100 / this.prizes.length;
    this.prizes.controls.forEach(control => {
      control.patchValue({ percentage: equalPercentage }, { emitEvent: false });
    });
    this.validatePercentages();
    
    // Emit the updated prizes after equalizing
    const currentPrizes = this.prizes.getRawValue();
    this.prizesUpdated.emit(currentPrizes);
  }

  validatePercentages(): boolean {
    const total = this.prizes.getRawValue()
      .reduce((sum, prize) => sum + (prize.percentage || 0), 0);
    
    if (Math.abs(total - 100) > 0.01) { // Allow for small floating point differences
      this.errorMessage = `Total percentage must equal 100%. Current total: ${total.toFixed(1)}%`;
      return false;
    }
    
    this.errorMessage = null;
    return true;
  }

  isValid(): boolean {
    return this.prizeForm.valid && this.validatePercentages();
  }

  getCurrentPrizes(): PrizeConfig[] {
    return this.prizes.getRawValue();
  }
}
