import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
@Component({
  selector: 'app-root',
  template: `<h1>Posts</h1>
  <div>{{post?.article}}</div>
  <div><span>By:</span><span>{{post?.user?.name}}</span></div>
  <div *ngFor="let c of post.comments">
  <input type="text" [value]="c.data" (input) = "updatedComment = $event.target.value">
  <div><span>By:</span><span>{{c.user.name}}</span></div>
  </div>
  <button (click)=save()>Save</button>
  `,
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  post:any = {};
  updatedComment:string ="";
  constructor( private store: Store<{posts: any}>) {
    //this.store.dispatch({type: 'GETPOSTS'});
    //this.store.dispatch({type: 'NORMALIZEDPOST'});
    this.store.dispatch({type: 'NRMZLIB'});
    // this.store.select("posts").subscribe( post => {
    //   this.post = {...post.posts};
    // });
    // this.store.select("posts").subscribe(state => {
    //   let posts = state.posts;
    //   posts.user = state.users[posts.user];
    //   posts.comments = posts.comments.map(item => {
    //     return state.comments[item];
    //   });
    //   this.post = posts;
    // })
    this.store.select("posts").subscribe(state => {
      let entities = state.entities;
      let post = entities.posts[state.result];
      post.user = entities.user[post.user];
      post.comments = post.comments.map(item => entities.comments[item]);
      this.post = post;
    })
  }

  save(){
    //this.store.dispatch({type: "UPDATEPOSTS", payload: this.post});
    this.store.dispatch({type: "UPDATECOMMENT", payload: this.updatedComment});
  }
}
