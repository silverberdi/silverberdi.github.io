---
layout: page
title: Contact
permalink: /contact/
---

# Get in Touch

Have a question, suggestion, or just want to say hi? Feel free to reach out!

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 32px;">

  <!-- Card: Schedule a Call -->
  <div style="padding: 32px; border: 1px solid var(--border-color); border-radius: 16px; background: var(--background-alt-color-2);">
    <img src="{{ "/assets/images/schedule.png" | relative_url }}" alt="Schedule a call" style="width: 100%; border-radius: 8px; margin-bottom: 16px; aspect-ratio: 16/9; object-fit: cover;">
    <h3 style="margin-bottom: 12px; font-size: 20px;">Schedule a Call</h3>
    <p style="margin-bottom: 24px; font-size: 15px; color: var(--text-alt-color);">Book a 30-minute slot to discuss your project or idea.</p>
    <a href="https://calendly.com/silverio-bernal" class="button button--secondary button--big" target="_blank" rel="noopener" style="display: flex; align-items: center; justify-content: center; gap: 8px;">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
      </svg>
      Schedule a Call
    </a>
  </div>

  <!-- Card: Send a Message -->
  <div style="padding: 32px; border: 1px solid var(--border-color); border-radius: 16px; background: var(--background-alt-color-2);">
    <h3 style="margin-bottom: 12px; font-size: 20px;">Send a Message</h3>
    <p style="margin-bottom: 24px; font-size: 15px; color: var(--text-alt-color);">Prefer writing? Fill out the form and I'll get back to you.</p>
    <form class="form" action="https://formspree.io/f/xpwzazyg" method="POST">
      <div class="form__group">
        <input type="text" class="form__input" name="name" placeholder="Your Name" required>
      </div>
      <div class="form__group">
        <input type="email" class="form__input" name="_replyto" placeholder="Your Email" required>
      </div>
      <div class="form__group">
        <textarea class="form__input" name="message" rows="7" placeholder="Your Message" required></textarea>
      </div>
      <div class="form__group">
        <button type="submit" class="button button--primary button--big">Send Message</button>
      </div>
    </form>
  </div>

</div>

## Other Ways to Reach Me

- **Calendly**: [Schedule a call](https://calendly.com/silverio-bernal){:target="_blank"}
- **GitHub**: [github.com/{{ site.github_username }}](https://github.com/{{ site.github_username }}){:target="_blank"}
- **LinkedIn**: [linkedin.com/in/silveriobernal](https://linkedin.com/in/silveriobernal){:target="_blank"}
- **Email**: [silverio.bernal@gmail.com](mailto:silverio.bernal@gmail.com)
