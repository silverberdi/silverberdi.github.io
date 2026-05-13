---
layout: page
title: Contact
permalink: /contact/
---

# Get in Touch

Have a question, suggestion, or just want to say hi? Feel free to reach out!

<form class="form" action="https://formspree.io/f/your-email" method="POST">
  <div class="form__group">
    <input type="text" class="form__input" name="name" placeholder="Your Name" required>
  </div>
  <div class="form__group">
    <input type="email" class="form__input" name="_replyto" placeholder="Your Email" required>
  </div>
  <div class="form__group">
    <textarea class="form__input" name="message" rows="6" placeholder="Your Message" required></textarea>
  </div>
  <div class="form__group">
    <button type="submit" class="button button--primary button--big">Send Message</button>
  </div>
</form>

## Other Ways to Reach Me

- **GitHub**: [github.com/{{ site.github_username }}](https://github.com/{{ site.github_username }})
- **Email**: {{ site.email | default: "your-email@example.com" }}