import {Component, OnInit, ChangeDetectionStrategy} from '@angular/core';
import {RouterLink} from '@angular/router';
import {User} from '../../models/user';
import {AuthService} from '../../services/auth.service';
import {TranslatePipe} from '@ngx-translate/core';


@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    TranslatePipe
  ],
  templateUrl: './header.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit{

  user: User | null = null;

  constructor(private authService: AuthService) {
  }


  /**
   *
   */
  ngOnInit(): void {
    this.user = this.authService.getUser()
  }
}
