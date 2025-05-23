import { Component, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { ChatMessage, GiveawayService } from '../../services/GiveawayService/giveaway.service';
import { PrizeWheelComponent } from '../prize-wheel/prize-wheel.component';

@Component({
  selector: 'app-winners',
  templateUrl: './winners.component.html',
  styleUrls: ['./winners.component.scss'],
})
export class WinnersComponent {
  winners: any;
  @Input() numberOfWinners!: number;
  copiedWinner: string | null = null;
  winnersChat$: Observable<ChatMessage[]>;

  constructor(
    private snackBar: MatSnackBar, 
    private giveawayService: GiveawayService,
    private dialog: MatDialog
  ) {
    // Subscribe to the winnersChat$ observable to get the messages
    this.winnersChat$ = this.giveawayService.winnersChat$;
  }

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

  clearWinners(){
    this.winners = null;
    this.giveawayService.clearWinners();
  }

  getBadgeIcon(badgeType: string): string {
    const badgeIcons: any = {
      'subscriber': '&#128313;', // 🔹
      'vip': '&#128081;',        // 👑
      'moderator': '&#128305;',  // 🛡️
      'founder': '&#9978;'       // ⚔️
    };
    return badgeIcons[badgeType] || '';
  }

  selectWinners(){
    const winners = this.giveawayService.selectRandomWinners(this.numberOfWinners);
    this.winners = winners;
  }

  openPrizeWheel() {
    const dialogRef = this.dialog.open(PrizeWheelComponent, {
      width: '1000px',
      height: '600px',
      disableClose: true,
      panelClass: 'prize-wheel-dialog',
      maxWidth: '90vw'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackBar.open(`Prize amount: $${result}!`, '', {
          duration: 3000,
        });
      }
    });
  }
}
