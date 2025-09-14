import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Facebook';
  isDark = false;
  ngOnInit() {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }

  toggleDarkMode() {
    const html = document.documentElement;
    if (html.classList.contains('dark')) {
      html.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      this.isDark = false;
    } else {
      html.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      this.isDark = true;
    }
  }
}
