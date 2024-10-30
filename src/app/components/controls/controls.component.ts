import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GiveawayService } from '../../services/GiveawayService/giveaway.service';

@Component({
  selector: 'app-controls',
  styleUrls: ['./controls.component.scss'],
  templateUrl: './controls.component.html',
})
export class ControlsComponent {
  @Input() winners: any;
  @Output() winnersChange = new EventEmitter<any>();
  @Output() keywordChange = new EventEmitter<any>();
  channelId = 0;
  channelName = "";
  keyword = '';
  numberOfWinners = 1;
  giveawayActive = false;

  private mockUserCount = 0;
  private simulationInterval: any;

  constructor(private giveawayService: GiveawayService, private http: HttpClient) {}

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

  async toggleGiveaway() {
    if (this.giveawayActive) {
      this.giveawayService.pauseEntries(this.channelId);
      this.giveawayActive = false;
    } else {
      await this.giveawayService.allowEntries(this.channelId, this.keyword);
      this.giveawayActive = true;
    }
  }

  selectWinners(){
    const winners = this.giveawayService.selectRandomWinners(this.numberOfWinners);
    this.winners = winners;
    this.winnersChange.emit(this.winners);
  }

  clearEntries(){
    this.giveawayService.clearEntrants();
  }

  onKeywordChange(newKeyword: string) {
    this.keyword = newKeyword;
    this.keywordChange.emit(newKeyword);
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
