import { Component, Input } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GiveawayService } from '../../services/GiveawayService/giveaway.service';

@Component({
  selector: 'app-winners',
  templateUrl: './winners.component.html',
  styleUrls: ['./winners.component.scss'],
})
export class WinnersComponent {
  winners: any;
  @Input() numberOfWinners!: number;
  copiedWinner: string | null = null;

  constructor(private snackBar: MatSnackBar, private giveawayService: GiveawayService) {}

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
  }

  getBadgeIcon(badgeType: string): string {
    const badgeIcons: any = {
      'subscriber': '&#128313;', // 🔹
      'vip': '&#128081;',        // 👑
      'moderator': '&#128305;',  // 🛑
      'founder': '&#9978;'       // ⚔️
    };
    return badgeIcons[badgeType] || '';
  }

  selectWinners(){
    const winners = this.giveawayService.selectRandomWinners(this.numberOfWinners);
    this.winners = winners;
  }
}
