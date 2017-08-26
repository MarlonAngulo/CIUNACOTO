import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  messageClass;
  message;
  newPost = false;
  loadingUsers = false;
  form;
  commentForm;
  processing = false;
  username;
  userPosts;
  newComment = [];
  enabledComments = [];

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService
  ) {
    this.createNewUserForm(); // Create new user form on start up
    this.createCommentForm(); // Create form for posting comments on a user's user post
  }

  // Function to create new user form
  createNewUserForm() {
    this.form = this.formBuilder.group({
      // Title field
      title: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(50),
        Validators.minLength(5),
        this.alphaNumericValidation
      ])],
      // Body field
      body: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(500),
        Validators.minLength(5)
      ])]
    })
  }

  // Create form for posting comments
  createCommentForm() {
    this.commentForm = this.formBuilder.group({
      comment: ['', Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(200)
      ])]
    })
  }

  // Enable the comment form
  enableCommentForm() {
    this.commentForm.get('comment').enable(); // Enable comment field
  }

  // Disable the comment form
  disableCommentForm() {
    this.commentForm.get('comment').disable(); // Disable comment field
  }

  // Enable new user form
  enableFormNewUserForm() {
    this.form.get('title').enable(); // Enable title field
    this.form.get('body').enable(); // Enable body field
  }

  // Disable new user form
  disableFormNewUserForm() {
    this.form.get('title').disable(); // Disable title field
    this.form.get('body').disable(); // Disable body field
  }

  // Validation for title
  alphaNumericValidation(controls) {
    const regExp = new RegExp(/^[a-zA-Z0-9 ]+$/); // Regular expression to perform test
    // Check if test returns false or true
    if (regExp.test(controls.value)) {
      return null; // Return valid
    } else {
      return { 'alphaNumericValidation': true } // Return error in validation
    }
  }

  // Function to display new user form
  newUserForm() {
    this.newPost = true; // Show new user form
  }

  // Reload users on current page
  reloadUsers() {
    this.loadingUsers = true; // Used to lock button
    this.getAllUsers(); // Add any new users to the page
    setTimeout(() => {
      this.loadingUsers = false; // Release button lock after four seconds
    }, 4000);
  }

  // Function to post a new comment on user post
  draftComment(id) {
    this.commentForm.reset(); // Reset the comment form each time users starts a new comment
    this.newComment = []; // Clear array so only one post can be commented on at a time
    this.newComment.push(id); // Add the post that is being commented on to the array
  }

  // Function to cancel new post transaction
  cancelSubmission(id) {
    const index = this.newComment.indexOf(id); // Check the index of the user post in the array
    this.newComment.splice(index, 1); // Remove the id from the array to cancel post submission
    this.commentForm.reset(); // Reset  the form after cancellation
    this.enableCommentForm(); // Enable the form after cancellation
    this.processing = false; // Enable any buttons that were locked
  }

  // Function to submit a new user post
  onUserSubmit() {
    this.processing = true; // Disable submit button
    this.disableFormNewUserForm(); // Lock form

    // Create user object from form fields
    const user = {
      title: this.form.get('title').value, // Title field
      body: this.form.get('body').value, // Body field
      createdBy: this.username // CreatedBy field
    }

    // Function to save user into database
    this.authService.registerUser(user).subscribe(data => {
      // Check if user was saved to database or not
      if (!data.success) {
        this.messageClass = 'alert alert-danger'; // Return error class
        this.message = data.message; // Return error message
        this.processing = false; // Enable submit button
        this.enableFormNewUserForm(); // Enable form
      } else {
        this.messageClass = 'alert alert-success'; // Return success class
        this.message = data.message; // Return success message
        this.getAllUsers();
        // Clear form data after two seconds
        setTimeout(() => {
          this.newPost = false; // Hide form
          this.processing = false; // Enable submit button
          this.message = false; // Erase error/success message
          this.form.reset(); // Reset all form fields
          this.enableFormNewUserForm(); // Enable the form fields
        }, 2000);
      }
    });
  }

  // Function to go back to previous page
  goBack() {
    window.location.reload(); // Clear all variable states
  }

  // Function to get all users from the database
  getAllUsers() {
    // Function to GET all users from database
    this.authService.getAllUsers().subscribe(data => {
      this.userPosts = data.users; // Assign array to use in HTML
    });
  }

  // Function to post a new comment
  postComment(id) {
    this.disableCommentForm(); // Disable form while saving comment to database
    this.processing = true; // Lock buttons while saving comment to database
    const comment = this.commentForm.get('comment').value; // Get the comment value to pass to service function
    // Function to save the comment to the database
    this.authService.postComment(id, comment).subscribe(data => {
      this.getAllUsers(); // Refresh all users to reflect the new comment
      const index = this.newComment.indexOf(id); // Get the index of the user id to remove from array
      this.newComment.splice(index, 1); // Remove id from the array
      this.enableCommentForm(); // Re-enable the form
      this.commentForm.reset(); // Reset the comment form
      this.processing = false; // Unlock buttons on comment form
      if (this.enabledComments.indexOf(id) < 0) this.expand(id); // Expand comments for user on comment submission
    });
  }

  // Expand the list of comments
  expand(id) {
    this.enabledComments.push(id); // Add the current user post id to array
  }

  // Collapse the list of comments
  collapse(id) {
    const index = this.enabledComments.indexOf(id); // Get position of id in array
    this.enabledComments.splice(index, 1); // Remove id from array
  }

  ngOnInit() {
    // Get profile username on page load
    this.authService.getProfile().subscribe(profile => {
      this.username = profile.user.username; // Used when creating new user posts and comments
    });

    this.getAllUsers(); // Get all users on component load
  }

}
