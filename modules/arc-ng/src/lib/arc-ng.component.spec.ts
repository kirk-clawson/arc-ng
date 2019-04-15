import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArcNgComponent } from './arc-ng.component';

describe('ArcNgComponent', () => {
  let component: ArcNgComponent;
  let fixture: ComponentFixture<ArcNgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArcNgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArcNgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
