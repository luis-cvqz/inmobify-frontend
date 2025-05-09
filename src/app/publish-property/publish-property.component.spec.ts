import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishPropertyComponent } from './publish-property.component';

describe('PublishPropertyComponent', () => {
  let component: PublishPropertyComponent;
  let fixture: ComponentFixture<PublishPropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublishPropertyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublishPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
