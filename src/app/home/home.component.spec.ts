import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { PostsService } from '../service/posts.service';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

fdescribe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let postsServiceSpy: jasmine.SpyObj<PostsService>;
  let localStorageSpy: { [key: string]: string } = {};

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('PostsService', ['getPosts']);

    await TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [ReactiveFormsModule, HttpClientTestingModule],
      providers: [{ provide: PostsService, useValue: spy }],
    }).compileComponents();

    postsServiceSpy = TestBed.inject(PostsService) as jasmine.SpyObj<PostsService>;

    // Mock LocalStorage
    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      return localStorageSpy[key] || null;
    });
    spyOn(localStorage, 'setItem').and.callFake((key: string, value: string) => {
      localStorageSpy[key] = value;
    });
    spyOn(localStorage, 'clear').and.callFake(() => {
      localStorageSpy = {};
    });

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load posts from service if localStorage is empty', () => {
    const mockPosts = [
      { id: 1, userId: 1, content: 'Test Post', createdAt: new Date() }
    ];
    postsServiceSpy.getPosts.and.returnValue(of(mockPosts));
    localStorageSpy = {}; // Ensure empty

    component.ngOnInit();

    expect(postsServiceSpy.getPosts).toHaveBeenCalled();
    expect(component.posts.length).toBe(1);
    expect(component.posts[0].content).toBe('Test Post');
  });

  it('should load posts from localStorage if available', () => {
    const savedPosts = JSON.stringify([
      { id: 999, content: 'Saved Post', comments: [], likes: 5 }
    ]);
    localStorageSpy['posts'] = savedPosts;

    component.ngOnInit();

    expect(postsServiceSpy.getPosts).not.toHaveBeenCalled();
    expect(component.posts.length).toBe(1);
    expect(component.posts[0].content).toBe('Saved Post');
  });

  it('should create a new post', () => {
    component.posts = [];
    component.ngOnInit(); // Initialize form

    component.postForm.setValue({
      content: 'New Created Post',
      file: null
    });

    component.createPost();

    expect(component.posts.length).toBe(1);
    expect(component.posts[0].content).toBe('New Created Post');
    expect(localStorage.setItem).toHaveBeenCalled();
  });

  it('should like a post', () => {
    const post = { id: 1, likes: 0, liked: false };
    component.likePost(post);

    expect(post.likes).toBe(1);
    expect(post.liked).toBeTrue();
    expect(localStorage.setItem).toHaveBeenCalled();
  });

  it('should unlike a post', () => {
    const post = { id: 1, likes: 1, liked: true };
    component.likePost(post);

    expect(post.likes).toBe(0);
    expect(post.liked).toBeFalse();
    expect(localStorage.setItem).toHaveBeenCalled();
  });

  it('should add a comment', () => {
    const post: any = { id: 1, comments: [], newComment: 'Nice post!' };
    component.addComment(post);

    expect(post.comments.length).toBe(1);
    expect(post.comments[0].text).toBe('Nice post!');
    expect(post.newComment).toBe('');
    expect(localStorage.setItem).toHaveBeenCalled();
  });

  it('should not add empty comment', () => {
    const post = { id: 1, comments: [], newComment: '   ' };
    component.addComment(post);

    expect(post.comments.length).toBe(0);
  });

  it('should share a post', () => {
    const post = { id: 1, shares: 0 };
    component.sharePost(post);

    expect(post.shares).toBe(1);
    expect(localStorage.setItem).toHaveBeenCalled();
  });
});
