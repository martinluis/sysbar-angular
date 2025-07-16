import {Component, OnInit} from '@angular/core';
import {RouterLink} from '@angular/router';
import {User} from '../../models/user';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink
  ],
  templateUrl: './header.component.html',
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
