// src/app/entrants-list/entrants-list.component.ts

import { Component, Input, OnInit } from '@angular/core';
import { GiveawayService } from '../../services/GiveawayService/giveaway.service';
import { Observable, Subscription } from 'rxjs';
import { scan, tap } from 'rxjs/operators';

interface Entrant {
  id: string;
  username: string;
  badges: Badge[];
  color: string;
}

interface Badge {
  type: string;
}

@Component({
  selector: 'app-entrants-list',
  styleUrl: './entrants-list.component.scss',
  templateUrl: './entrants-list.component.html',
})
export class EntrantsListComponent implements OnInit {
  entrants: Entrant[] = [];
  private entrantsSubscription!: Subscription;

  public giveawayActive: boolean = false;

  @Input() channelId: number = 0;

  constructor(private giveawayService: GiveawayService) {}

  ngOnInit() {
    this.entrantsSubscription = this.giveawayService.entrants$.subscribe(
      (entrants: any) => {
        console.log(entrants);
        this.entrants = entrants;
      }
    );
  }

  ngOnDestroy() {
    if (this.entrantsSubscription) {
      this.entrantsSubscription.unsubscribe();
    }
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

  clearEntries(){
    this.giveawayService.clearEntrants();
  }

  async toggleGiveaway() {
    if (this.giveawayActive) {
      this.giveawayService.pauseEntries();
      this.giveawayActive = false;
    } else {
      await this.giveawayService.allowEntries();
      this.giveawayActive = true;
    }
  }
}
