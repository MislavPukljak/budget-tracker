import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-account',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './create-account.component.html',
  styleUrl: './create-account.component.scss'
})
export class CreateAccountComponent {
  private userService = inject(UserService);
  private router = inject(Router);

  accountForm: FormGroup = new FormGroup({
    name:  new FormControl('', [Validators.required])
  });

  createAccount() {
      this.userService.addUser(this.accountForm.value.name);
      this.router.navigateByUrl('');
  }

}
