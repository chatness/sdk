import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,

  styles: [
    `
      form {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      input {
        padding: 0.25rem;
      }

      button {
        padding: 0.45rem;
      }

      table {
        width: 100%;
      }
    `,
  ],
  template: `
    WIP
    <!-- <button
      (click)="increase()"
      title="click to increase the counter. which should reflect here in realtime if subscribed. experiment open many tabs at same time and see the changes reflect."
    >
      Increase count (realtime):
      {{ counter.total }}
    </button>
    <button (click)="reload()" title="click to refresh the page">
      Next Total (local): {{ counterTotalNext }}
    </button>
    <button
      (click)="unsubscribe()"
      title="click to unsubscribe all subscriptions"
    >
      Unsubscribe Realtime
    </button>
    <button
      (click)="subscribe()"
      title="click to re-subscribe all subscriptions"
    >
      Re-subscribe Realtime
    </button>

    <br />

    <h2>Sign Up</h2>
    <form [formGroup]="signUpForm" (ngSubmit)="signUp()">
      <label for="name">name: </label>
      <input id="name" type="text" formControlName="name" />
      <label for="email">email: </label>
      <input id="email" type="text" formControlName="email" />
      <label for="password">password: </label>
      <input id="password" type="text" formControlName="password" />
      <button type="submit" [disabled]="signUpForm.invalid">
        Create Account
      </button>
    </form>

    <hr />
    Error: {{ (signUpError | json) ?? '' }}
    <hr />
    <br />

    <ng-container *ngIf="session$ | async as session">
      <ng-container *ngIf="!session?.token">
        <h2>Sign In</h2>
        <form [formGroup]="signInForm" (ngSubmit)="signIn()">
          <label for="email">email </label>
          <input id="email" type="text" formControlName="email" />
          <label for="password">password: </label>
          <input id="password" type="text" formControlName="password" />
          <button type="submit" [disabled]="signInForm.invalid">
            Login Account
          </button>
        </form>
      </ng-container>

      <button *ngIf="session?.token" (click)="signOut()">
        Logout from {{ session.user.name }} ({{ session.user.email }})
      </button>
    </ng-container>

    <hr />
    Error: {{ (signInError | json) ?? '' }}

    <hr />
    <ng-container *ngIf="session$ | async as session">
      Session: {{ session | json }}
      <hr />
    </ng-container>

    <ng-container>
      <br />
      <h2>
        Public Users
        <button (click)="resetPublicUsers()">Force Reload</button>
        <button (click)="createRandomUser()">Add Random</button>
      </h2>
      <br />
      <table cellPadding="5" cellSpacing="10">
        <tr>
          <th align="left">name</th>
          <th align="left">email</th>
          <th>createdAt</th>
          <th *ngIf="(session$ | async)?.token">actions</th>
        </tr>
        <tr
          *ngFor="let user of publicUsers$ | async; trackBy: trackByUserEmail"
        >
          <td>{{ user.name }}</td>
          <td>{{ user.email }}</td>
          <td align="center">{{ user.createdAt }}</td>
          <td align="center" *ngIf="(session$ | async)?.token">
            <button (click)="deleteUser(user.objectId)">Delete</button>
          </td>
        </tr>
      </table>

      <h4>@Fast Promise</h4>
      <code>
        <pre>Random number: {{ fromPromise$ | async }}</pre>
      </code>

      <h4>@Fast Query (needs login)</h4>
      <code>
        <pre>Oldest users: {{ oldestUsers$ | async | json }}</pre>
      </code>

      <h4>Cool reducer</h4>
      <code>
        <pre>{{ cool$ | async | json }}</pre>
      </code>
    </ng-container>

    <br />

    <h2>Change Current User Email</h2>
    <form [formGroup]="changeEmailForm" (ngSubmit)="changeEmail()">
      <label for="email">new email: </label>
      <input id="email" type="text" formControlName="email" />
      <label for="password">current password: </label>
      <input id="password" type="text" formControlName="password" />
      <button type="submit" [disabled]="changeEmailForm.invalid">
        Change Email
      </button>
    </form>

    <hr />
    Error: {{ (changeEmailError | json) ?? '' }}
    <hr />
    Session: {{ session$ | async | json }}
    <br />
    <br />
    <h2>Change Current User Password</h2>
    <form [formGroup]="changePasswordForm" (ngSubmit)="changePassword()">
      <label for="currentPassword">current password: </label>
      <input
        id="currentPassword"
        type="text"
        formControlName="currentPassword"
      />

      <label for="newPassword">new password: </label>
      <input id="newPassword" type="text" formControlName="newPassword" />

      <button type="submit" [disabled]="changePasswordForm.invalid">
        Change Password
      </button>
    </form>

    <hr />
    Error: {{ (changePasswordError | json) ?? '' }}
    <hr />
    Session: {{ session$ | async | json }}
    <br />

    <br />
    <h2>User Forgot Password</h2>
    <form [formGroup]="forgotPasswordForm" (ngSubmit)="forgotPassword()">
      <label for="email">email: </label>
      <input id="email" type="text" formControlName="email" />

      <button type="submit" [disabled]="forgotPasswordForm.invalid">
        Send Password Reset Email
      </button>
    </form>

    <hr />
    Error: {{ (forgotPasswordError | json) ?? '' }}
    <br /> -->
  `,
})
export class AppComponent {
  signUpForm = new FormGroup({
    name: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
  });

  signInForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  changeEmailForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  changePasswordForm = new FormGroup({
    currentPassword: new FormControl(''),
    newPassword: new FormControl(''),
  });

  forgotPasswordForm = new FormGroup({
    email: new FormControl(''),
  });

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnDestroy() {}

  ngOnInit() {}
}
