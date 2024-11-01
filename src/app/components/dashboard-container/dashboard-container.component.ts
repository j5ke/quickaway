import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard-container',
  templateUrl: './dashboard-container.component.html',
  styleUrl: './dashboard-container.component.scss'
})
export class DashboardContainerComponent {
  numberOfWinners: number = 1;
  keyword: string = "";

  channelId = 0;

  onNumberOfWinnersChange(newWinners: number) {
    this.numberOfWinners = newWinners;
  }

  onKeywordChange(nkeyword:any){
    this.keyword = nkeyword;
  }

  onChannelLoaded(nId: number){
    this.channelId = nId;
  }
}
