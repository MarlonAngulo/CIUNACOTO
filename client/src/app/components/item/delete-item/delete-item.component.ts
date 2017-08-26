import { Component, OnInit } from '@angular/core';
import { ItemService } from '../../../services/item.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-delete-item',
  templateUrl: './delete-item.component.html',
  styleUrls: ['./delete-item.component.css']
})
export class DeleteItemComponent implements OnInit {
  message;
  messageClass;
  foundItem = false;
  processing = false;
  item;
  currentUrl;

  constructor(
    private itemService: ItemService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  // Function to delete items
  deleteItem() {
    this.processing = true; // Disable buttons
    // Function for DELETE request
    this.itemService.deleteItem(this.currentUrl.id).subscribe(data => {
      // Check if delete request worked
      if (!data.success) {
        this.messageClass = 'alert alert-danger'; // Return error bootstrap class
        this.message = data.message; // Return error message
      } else {
        this.messageClass = 'alert alert-success'; // Return bootstrap success class
        this.message = data.message; // Return success message
        // After two second timeout, route to item page
        setTimeout(() => {
          this.router.navigate(['/item']); // Route users to item page
        }, 2000);
      }
    });
  }

  ngOnInit() {
    this.currentUrl = this.activatedRoute.snapshot.params; // Get URL paramaters on page load
    // Function for GET request to retrieve item
    this.itemService.getSingleItem(this.currentUrl.id).subscribe(data => {
      // Check if request was successfull
      if (!data.success) {
        this.messageClass = 'alert alert-danger'; // Return bootstrap error class
        this.message = data.message; // Return error message
      } else {
        // Create the item object to use in HTML
        this.item = {
          title: data.item.title, // Set title
          body: data.item.body, // Set body
          createdBy: data.item.createdBy, // Set created_by field
          createdAt: data.item.createdAt // Set created_at field
        }
        this.foundItem = true; // Displaly item window
      }
    });
  }

}
