import { Component, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-winners',
  templateUrl: './winners.component.html',
  styleUrls: ['./winners.component.scss'],
})
export class WinnersComponent {
  @Input() winners: any;
  copiedWinner: string | null = null;

  constructor(private snackBar: MatSnackBar) {}

  copyUsername(username: string) {
    navigator.clipboard.writeText(username).then(
      () => {
        this.copiedWinner = username;
        this.snackBar.open(`${username} copied to clipboard!`, '', {
          duration: 3000,
        });
        // Reset the copied state after a short delay
        setTimeout(() => {
          this.copiedWinner = null;
        }, 3000);
      },
      (err) => {
        console.error('Could not copy text: ', err);
      }
    );
  }
}
