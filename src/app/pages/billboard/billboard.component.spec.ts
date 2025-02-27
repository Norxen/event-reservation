import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillboardComponent } from './billboard.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('BillboardComponent', () => {
  let component: BillboardComponent;
  let fixture: ComponentFixture<BillboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillboardComponent, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(BillboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
