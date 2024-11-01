// giveaway.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Entrant {
  id: string;
  username: string;
  badges: Object[]
}

@Injectable({
  providedIn: 'root',
})
export class GiveawayService {
  private ws: WebSocket | null = null;
  private entrantsSubject = new BehaviorSubject<Entrant[]>([]);
  public entrants$ = this.entrantsSubject.asObservable();

  private keyword: string = "";

  private channelId: number = 0;

  constructor() {}

  getNumberOfEntrants(){
    return this.entrantsSubject.getValue().length;
  }

  allowEntries() {
    this.startWebSocket(this.channelId, this.keyword);
  }

  pauseEntries() {
    this.closeWebSocket(this.channelId);
  }

  setKeyword(keyword: string){
    this.keyword = keyword;
  }

  setChannelId(channelId: number){
    this.channelId = channelId;
  }

  getChannelId(){
    return this.channelId;
  }

  selectRandomWinners( numberOfWinners: number){
    const entrants = this.entrantsSubject.getValue();
    if (entrants.length === 0) {
      return [];
    }
    // Select random winners
    const shuffledEntrants = entrants.sort(() => 0.5 - Math.random());
    const winners = shuffledEntrants
      .slice(0, numberOfWinners)
      .map((entrant) => {
        return { id: entrant.id, username: entrant.username, badges: entrant.badges };
      });
      return winners;
  }

  clearEntrants(){
    // Clear entrants after selecting winners
    this.entrantsSubject.next([]);
  }

  private startWebSocket(channelId: number, keyword: string) {
    const url = `wss://ws-us2.pusher.com/app/32cbd69e4b950bf97679`;
    const urlParams = new URLSearchParams({
      protocol: '7',
      client: 'js',
      version: '7.4.0',
      flash: 'false',
    });
    this.ws = new WebSocket(`${url}?${urlParams.toString()}`);

    this.ws.onopen = () => {
      const subscribeMessage = JSON.stringify({
        event: 'pusher:subscribe',
        data: {
          channel: `chatrooms.${channelId}.v2`,
        },
      });
      this.ws!.send(subscribeMessage);
    };

    this.ws.onmessage = (event) => {
      const message = event.data;
      const data = JSON.parse(message);

      if (
        data.channel === `chatrooms.${channelId}.v2` &&
        data.event === 'App\\Events\\ChatMessageEvent'
      ) {
        const chatData = JSON.parse(data.data);
        const content = chatData.content.toLowerCase();

        if (content.includes(keyword.toLowerCase())) {
          const entrantId = chatData.sender.id;
          const entrantUsername = chatData.sender.username;
          const badges = chatData.sender.identity.badges;

          const entrant: Entrant = { id: entrantId, username: entrantUsername, badges: badges };
          const currentEntrants = this.entrantsSubject.getValue();

          if (!currentEntrants.some(e => e.id === entrantId)) {
            const updatedEntrants = [...currentEntrants, entrant];
            this.entrantsSubject.next(updatedEntrants);
          }
        }
      }
    };

    this.ws.onclose = () => { };
  }

  private closeWebSocket(channelId: number) {
    if (this.ws) {
      const unsubscribeMessage = JSON.stringify({
        event: 'pusher:unsubscribe',
        data: {
          channel: `chatrooms.${channelId}.v2`,
        },
      });
      this.ws.send(unsubscribeMessage);

      this.ws.close();
      this.ws = null;
    }
  }
}
