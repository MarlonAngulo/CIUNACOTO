import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  username = '';
  email = '';
  usertype = '';
  usertypedesc = '';

  constructor(
    public authService: AuthService,
    private router: Router,
    private flashMessagesService: FlashMessagesService
  ) { }

  // Function to logout user
  onLogoutClick() {
    this.authService.logout(); // Logout user
    this.flashMessagesService.show('You are logged out', { cssClass: 'alert-info' }); // Set custom flash message
    this.router.navigate(['/']); // Navigate back to home page
  }

  ngOnInit() {
    // Once component loads, get user's data to display on profile
  this.authService.getProfile().subscribe(profile => {
    this.username = profile.user.username; // Set username
    this.email = profile.user.email; // Set e-mail
    this.usertype = profile.user.userType; // Set user type
    switch(this.usertype) {
       case "1": {
          //statements;
          this.usertypedesc = "Adm"; // Set user type description to "Administrador"
          break;
       }
       case "2": {
          //statements;
          this.usertypedesc = "Usr"; // Set user type description to "Usuario"
          break;
       }
       default: {
          //statements;
          this.usertypedesc = "?"; // Set user type description to "?"
          break;
       }
    }
  });
  }

}
