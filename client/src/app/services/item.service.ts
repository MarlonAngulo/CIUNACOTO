import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Http, Headers, RequestOptions } from '@angular/http';

@Injectable()
export class ItemService {

  options;
  domain = this.authService.domain;

  constructor(
    private authService: AuthService,
    private http: Http
  ) { }

  // Function to create headers, add token, to be used in HTTP requests
  createAuthenticationHeaders() {
    this.authService.loadToken(); // Get token so it can be attached to headers
    // Headers configuration options
    this.options = new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/json', // Format set to JSON
        'authorization': this.authService.authToken // Attach token
      })
    });
  }

  // Function to create a new item post
  newItem(item) {
    this.createAuthenticationHeaders(); // Create headers
    return this.http.post(this.domain + 'items/newItem', item, this.options).map(res => res.json());
  }

  // Function to get all items from the database
  getAllItems() {
    this.createAuthenticationHeaders(); // Create headers
    return this.http.get(this.domain + 'items/allItems', this.options).map(res => res.json());
  }

  // Function to get the item using the id
  getSingleItem(id) {
    this.createAuthenticationHeaders(); // Create headers
    return this.http.get(this.domain + 'items/singleItem/' + id, this.options).map(res => res.json());
  }

  // Function to edit/update item post
  editItem(item) {
    this.createAuthenticationHeaders(); // Create headers
    return this.http.put(this.domain + 'items/updateItem/', item, this.options).map(res => res.json());
  }

  // Function to delete a item
  deleteItem(id) {
    this.createAuthenticationHeaders(); // Create headers
    return this.http.delete(this.domain + 'items/deleteItem/' + id, this.options).map(res => res.json());
  }

  // Function to like a item post
  likeItem(id) {
    const itemData = { id: id };
    return this.http.put(this.domain + 'items/likeItem/', itemData, this.options).map(res => res.json());
  }

  // Function to dislike a item post
  dislikeItem(id) {
    const itemData = { id: id };
    return this.http.put(this.domain + 'items/dislikeItem/', itemData, this.options).map(res => res.json());
  }

  // Function to post a comment on a item post
  postComment(id, comment) {
    this.createAuthenticationHeaders(); // Create headers
    // Create itemData to pass to backend
    const itemData = {
      id: id,
      comment: comment
    }
    return this.http.post(this.domain + 'items/comment', itemData, this.options).map(res => res.json());

  }

}
