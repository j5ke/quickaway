import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Entrant {
  id: string;
  username: string;
  badges: Badge[];
  color: string;
}

export interface Badge {
  type: string;
}

export interface ChatMessage {
  senderId: string;
  senderUsername: string;
  message: string;
  timestamp: string;
  entrant: Entrant;
}

@Injectable({
  providedIn: 'root',
})
export class GiveawayService {
  private ws: WebSocket | null = null;
  private entrantsSubject = new BehaviorSubject<Entrant[]>([]);
  public entrants$ = this.entrantsSubject.asObservable();

  private winners: Entrant[] = [];
  private winnersChatSubject = new BehaviorSubject<ChatMessage[]>([]);
  public winnersChat$ = this.winnersChatSubject.asObservable();

  private keyword: string = '';
  private channelId: number = 0;
  private subLuck: number = 1;

  private paused: boolean = false;

  constructor() {}

  setSubLuck(n: number) {
    this.subLuck = n;
  }

  getNumberOfEntrants() {
    return this.entrantsSubject.getValue().length;
  }

  allowEntries() {
    this.startWebSocket(this.channelId, this.keyword);
  }

  clearWinners() {
    this.winners = [];
    this.winnersChatSubject.next([]);
  }

  setKeyword(keyword: string) {
    this.keyword = keyword;
  }

  setChannelId(channelId: number) {
    this.channelId = channelId;
  }

  getChannelId() {
    return this.channelId;
  }

  clearEntrants() {
    this.entrantsSubject.next([]);
  }

  pauseEntries() {
    this.paused = !this.paused;
  }

  selectRandomWinners(numberOfWinners: number) {
    const entrants = this.entrantsSubject.getValue();
    if (entrants.length === 0) {
      return [];
    }

    const adjustedEntrants: Array<{ id: string, username: string, badges: any[], color: string }> = [];

    entrants.forEach(entrant => {
      const isSubscriber = entrant.badges.some(badge => badge.type === 'subscriber');
      const multiplier = isSubscriber ? this.subLuck : 1;
      for (let i = 0; i < multiplier; i++) {
        adjustedEntrants.push(entrant);
      }
    });

    const shuffledEntrants = adjustedEntrants.sort(() => 0.5 - Math.random());
    const winnerSet = new Set<string>();
    const winners: Array<{ id: string, username: string, badges: any[], color: string }> = [];

    while (winners.length < numberOfWinners && shuffledEntrants.length > 0) {
      const selectedEntrant = shuffledEntrants.pop();
      if (selectedEntrant && !winnerSet.has(selectedEntrant.id)) {
        winners.push({
          id: selectedEntrant.id,
          username: selectedEntrant.username,
          badges: selectedEntrant.badges,
          color: selectedEntrant.color
        });
        winnerSet.add(selectedEntrant.id);
      }
    }
    
    this.winners = winners;
    return winners;
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
        const content = chatData.content;
        const senderId = chatData.sender.id;
        const senderUsername = chatData.sender.username;
        const timestamp = chatData.timestamp;

        // Add entrant to the entrants pool based on the keyword (for entries)
        if (!this.paused && content.toLowerCase().includes(keyword.toLowerCase())) {
          const entrant: Entrant = {
            id: senderId,
            username: senderUsername,
            badges: chatData.sender.identity.badges,
            color: chatData.sender.identity.color
          };
          console.log(entrant);
          const currentEntrants = this.entrantsSubject.getValue();
          if (!currentEntrants.some(e => e.id === senderId)) {
            const updatedEntrants = [...currentEntrants, entrant];
            this.entrantsSubject.next(updatedEntrants);
          }
        }

        // Check if the sender is a winner and add the message to the winners chat
        const isWinner = this.winners.some(winner => winner.id === senderId);
        const entrant: Entrant = {
          id: senderId,
          username: senderUsername,
          badges: chatData.sender.identity.badges,
          color: chatData.sender.identity.color
        };
        if (isWinner) {
          const chatMessage: ChatMessage = {
            senderId,
            senderUsername,
            message: content,
            timestamp,
            entrant: entrant
          };
          const currentChats = this.winnersChatSubject.getValue();
          this.winnersChatSubject.next([...currentChats, chatMessage]);
        }
      }
    };

    this.ws.onclose = () => {};
  }

  closeWebSocket(channelId: number) {
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