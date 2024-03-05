import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignupPrivacyPolicyPagePage } from './signup-privacy-policy-page.page';

describe('SignupPrivacyPolicyPagePage', () => {
  let component: SignupPrivacyPolicyPagePage;
  let fixture: ComponentFixture<SignupPrivacyPolicyPagePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(SignupPrivacyPolicyPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
