import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-delete-user',
  templateUrl: './delete-user.component.html',
  styleUrls: ['./delete-user.component.css']
})
export class DeleteUserComponent implements OnInit {
  message;
  messageClass;
  foundUser = false;
  processing = false;
  user;
  currentUrl;

  constructor(
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  // Function to delete users
  deleteUser() {
    this.processing = true; // Disable buttons
    // Function for DELETE request
    this.authService.deleteUser(this.currentUrl.id).subscribe(data => {
      // Check if delete request worked
      if (!data.success) {
        this.messageClass = 'alert alert-danger'; // Return error bootstrap class
        this.message = data.message; // Return error message
      } else {
        this.messageClass = 'alert alert-success'; // Return bootstrap success class
        this.message = data.message; // Return success message
        // After two second timeout, route to user page
        setTimeout(() => {
          this.router.navigate(['/user']); // Route users to user page
        }, 2000);
      }
    });
  }

  ngOnInit() {
    this.currentUrl = this.activatedRoute.snapshot.params; // Get URL paramaters on page load
    // Function for GET request to retrieve user
    this.authService.getSingleUser(this.currentUrl.id).subscribe(data => {
      // Check if request was successfull
      if (!data.success) {
        this.messageClass = 'alert alert-danger'; // Return bootstrap error class
        this.message = data.message; // Return error message
      } else {
        // Create the user object to use in HTML
        this.user = {
          title: data.user.title, // Set title
          body: data.user.body, // Set body
          createdBy: data.user.createdBy, // Set created_by field
          createdAt: data.user.createdAt // Set created_at field
        }
        this.foundUser = true; // Displaly user window
      }
    });
  }

}
