import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  username = '';
  email = '';
  usertype = '';
  usertypedesc = '';

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
    // Once component loads, get user's data to display on profile
    this.authService.getProfile().subscribe(profile => {
    this.username = profile.user.username; // Set username
    this.email = profile.user.email; // Set e-mail
    this.usertype = profile.user.userType; // Set user type
    switch(this.usertype) {
         case "1": {
            //statements;
            this.usertypedesc = "Administrador"; // Set user type description to "Administrador"
            break;
         }
         case "2": {
            //statements;
            this.usertypedesc = "Usuario"; // Set user type description to "Usuario"
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
