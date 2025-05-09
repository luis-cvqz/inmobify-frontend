import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostsSummaryComponent } from './posts-summary.component';

describe('PostsSummaryComponent', () => {
  let component: PostsSummaryComponent;
  let fixture: ComponentFixture<PostsSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostsSummaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostsSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
