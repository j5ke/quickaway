import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { GiveawayService } from '../../services/GiveawayService/giveaway.service';

@Component({
  selector: 'app-controls',
  styleUrls: ['./controls.component.scss'],
  templateUrl: './controls.component.html',
})
export class ControlsComponent implements OnDestroy {
  @Input() winners: any;
  @Output() keywordChange = new EventEmitter<any>();
  @Output() numberOfWinnersChange = new EventEmitter<any>();
  @Output() channelLoaded = new EventEmitter<any>();
  channelId = 0;
  channelName = "";
  keyword = '';
  numberOfWinners = 1;
  giveawayActive = false;
  subLuck = 1;

  private mockUserCount = 0;
  private simulationInterval: any;

  constructor(private giveawayService: GiveawayService, private http: HttpClient) {}

  ngOnDestroy(): void {
    this.giveawayService.closeWebSocket(this.channelId);
  }

  // Function to load the channel ID based on the channel name
  loadChannelId() {
    if (!this.channelName) {
      console.error('Channel name is required');
      return;
    }

    const apiUrl = `https://kick.com/api/v2/channels/${this.channelName}`;

    this.http.get<any>(apiUrl).subscribe(
      (data) => {
        if (data && data.chatroom && data.chatroom.id) {
          this.channelId = data.chatroom.id;
          this.onChannelLoaded(this.channelId);
          console.log(`Channel ID loaded: ${this.channelId}`);
        } else {
          console.error('Chatroom ID not found in the response');
          this.channelId = 0; // Reset to 0 if not found
        }
      },
      (error) => {
        console.error('Error fetching channel data', error);
        this.channelId = 0; // Reset to 0 on error
      }
    );
  }

  onKeywordChange(newKeyword: string) {
    this.keyword = newKeyword;
    this.giveawayService.setKeyword(newKeyword);
    this.keywordChange.emit(newKeyword);
  }

  onNumberOfWinnerChange(n: number){
    this.numberOfWinners = n;
    this.numberOfWinnersChange.emit(n);
  }

  onChannelLoaded(n: number){
    this.channelLoaded.emit(n);
    this.giveawayService.setChannelId(n);
  }

  onSubLuckChange(n: number){
    this.giveawayService.setSubLuck(n);
  }

  // mockEnter() {
  //   this.mockUserCount++;
  //   const id = `mock-user-${this.mockUserCount}`;
  //   const username = `MockUser${this.mockUserCount}`;
  //   this.giveawayService.mockEnter(id, username);
  // }

  // simulateHighLoad() {
  //   const entriesPerSecond = 500;
  //   const durationInSeconds = 5;
  //   const totalEntries = entriesPerSecond * durationInSeconds;
  //   let entriesSent = 0;

  //   // Clear any existing interval
  //   if (this.simulationInterval) {
  //     clearInterval(this.simulationInterval);
  //   }

  //   // Calculate interval time in milliseconds
  //   const intervalTime = 1000 / entriesPerSecond;

  //   this.simulationInterval = setInterval(() => {
  //     if (entriesSent >= totalEntries) {
  //       clearInterval(this.simulationInterval);
  //       console.log('Simulation completed.');
  //       return;
  //     }

  //     this.mockEnter();
  //     entriesSent++;
  //   }, intervalTime);
  // }

  
}
