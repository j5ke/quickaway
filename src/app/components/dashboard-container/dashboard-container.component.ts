import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard-container',
  templateUrl: './dashboard-container.component.html',
  styleUrl: './dashboard-container.component.scss'
})
export class DashboardContainerComponent {
  winners: any;
  keyword: string = "";

  onWinnersChange(newWinners: any) {
    this.winners = newWinners;
  }

  onKeywordChange(nkeyword:any){
    this.keyword = nkeyword;
  }
}
