import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntrantsListComponent } from './entrants-list.component';

describe('EntrantsListComponent', () => {
  let component: EntrantsListComponent;
  let fixture: ComponentFixture<EntrantsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntrantsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntrantsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
