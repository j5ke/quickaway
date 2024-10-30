// src/app/entrants-list/entrants-list.component.ts

import { Component, OnInit } from '@angular/core';
import { GiveawayService } from '../../services/GiveawayService/giveaway.service';
import { Observable, Subscription } from 'rxjs';
import { scan, tap } from 'rxjs/operators';

interface Entrant {
  id: string;
  username: string;
}

@Component({
  selector: 'app-entrants-list',
  styleUrl: './entrants-list.component.scss',
  templateUrl: './entrants-list.component.html',
})
export class EntrantsListComponent implements OnInit {
  entrants: Entrant[] = [];
  private entrantsSubscription!: Subscription;

  constructor(private giveawayService: GiveawayService) {}

  ngOnInit() {
    this.entrantsSubscription = this.giveawayService.entrants$.subscribe(
      (entrants: any) => {
        this.entrants = entrants;
      }
    );
  }

  ngOnDestroy() {
    if (this.entrantsSubscription) {
      this.entrantsSubscription.unsubscribe();
    }
  }
}
