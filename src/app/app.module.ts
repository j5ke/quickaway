// src/app/app.module.ts

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

// Angular Material Modules
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

// Components
import { AppComponent } from './app.component';
import { ControlsComponent } from './components/controls/controls.component';
import { EntrantsListComponent } from './components/entrants-list/entrants-list.component';

// Service
import { GiveawayService } from './services/GiveawayService/giveaway.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WinnersComponent } from './components/winners/winners.component';
import { DashboardContainerComponent } from './components/dashboard-container/dashboard-container.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { RouterModule } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
    declarations: [
        AppComponent,
        ControlsComponent,
        WinnersComponent,
        EntrantsListComponent,
        DashboardContainerComponent,
        LandingPageComponent,
      ],
      imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    // Angular Material Modules
    MatToolbarModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSliderModule,
    MatListModule,
    MatIconModule,
    ScrollingModule,
    RouterModule,
    AppRoutingModule
],
  providers: [GiveawayService],
  bootstrap: [AppComponent]
})
export class AppModule { }
