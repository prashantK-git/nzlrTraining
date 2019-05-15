import { Action } from '@ngrx/store';
import { schema, normalize } from 'normalizr';

export const getPost = "GETPOSTS"
export const updatePost = "UPDATEPOSTS"
export const initialState: any = {};

export function postReducer(state = initialState, action: Action | any) {
  switch (action.type) {
    case getPost:
      return { ...state,
        posts: returnUnNrm()
      };
    case updatePost: {
      let data = {...action.payload};
      return {
        ...state,
        ...data
      }
    }
    case "UPDATECOMMENT": {
      let _posts = {...state.posts}
      let _comments = [..._posts.comments];
      _comments[0].data = action.payload;
      _posts = {
        ..._posts,
        comments: [..._comments]
      }
      return {
        ...state,
        ..._posts
      }
    }
    case "NORMALIZEDPOST":
    return {
      ...state,
     ...processData(returnUnNrm())
    }
    case "NRMZLIB":
    return {
      ...state,
      ...processWithLib(returnUnNrm())
    }
    default:
      return state;
  }
}

const userSchema = new schema.Entity('user');
const commentsSchema = new schema.Entity('comments', { user: userSchema });
const postsSchema = new schema.Entity('posts', {user: userSchema, comments: [commentsSchema]);
function processWithLib(unNrmPost) {
  const normalizedData = normalize(unNrmPost, postsSchema);
  return normalizedData;
}
function processData( unNrmPost ) {
  let users = {};
  let comments = {};
  users[unNrmPost.user.id] = unNrmPost.user;
  unNrmPost.user = unNrmPost.user.id;
  unNrmPost.comments = unNrmPost.comments.map( item => {
    users[item.user.id] = item.user;
    item.user = item.user.id;
    comments[item.id] = item;
    return item.id;
  });
  return {
    "posts": unNrmPost,
    "users": users,
    "comments": comments
  }

}

function returnUnNrm () {
  return {
      "id": "1"
      "article": "post1",
      "user": {
        "name":"user 1",
        "id":"1"
      },
      "comments": [
        { "id":"1",
                "data": "comment 1",
                "user": {
                  "name":"user 2",
                  "id":"2"
                }
        },
       {  "id":"2",
                "data": "comment 2",
                "user": {
                  "name":"user 1",
                  "id":"1"
                },
        },
        {  "id":"3",
                "data": "comment 3",
                "user": {
                  "name":"user 3",
                  "id":"3"
                }
        }
      ]
    }
}
