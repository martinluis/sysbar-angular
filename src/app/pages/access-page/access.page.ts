import { Component } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {UserService} from '../../services/user.service';
import {Router} from '@angular/router';
import {ErrorHandlerService} from '../../services/error-handler.service';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-access-page',
  imports: [FormsModule],
  templateUrl: './access.page.html',
  standalone: true,
  styleUrl: './access.page.scss'
})
export class AccessPage {

  accessCode: string = '';
  errorMessage: string = ''

  constructor(private userService: UserService,
              private router: Router,
              private errorHandler: ErrorHandlerService,
              private authService: AuthService) {
  }

  /**
   *
   */
  onSubmitAccess() {
    this.userService.requestAccess(this.accessCode).subscribe({
      next: (data) => {
        this.authService.setUser(data)
        this.router.navigate(['dashboard']);
      },
      error: (err) => {
        this.errorMessage = this.errorHandler.parseError(err);
        this.accessCode = ''
      }
    })
  }
}
